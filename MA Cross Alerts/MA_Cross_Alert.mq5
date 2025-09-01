//+------------------------------------------------------------------+
//|                                                   MA_Cross_Alert |
//|                      Simple 2-MA Cross with Alerts (MT5)         |
//|                                      Public Domain / Use freely  |
//+------------------------------------------------------------------+
#property strict
#property indicator_chart_window
#property indicator_plots 4
#property indicator_buffers 4
#property version   "1.3"
//--- Plot 1: Fast MA line
#property indicator_label1  "FastMA"
#property indicator_type1   DRAW_LINE
#property indicator_color1  clrLime
#property indicator_style1  STYLE_SOLID
#property indicator_width1  2
//--- Plot 2: Slow MA line
#property indicator_label2  "SlowMA"
#property indicator_type2   DRAW_LINE
#property indicator_color2  clrOrange
#property indicator_style2  STYLE_SOLID
#property indicator_width2  2
//--- Plot 3: Bullish cross arrow
#property indicator_label3  "BullCross"
#property indicator_type3   DRAW_ARROW
#property indicator_color3  clrLime
#property indicator_width3  2
//--- Plot 4: Bearish cross arrow
#property indicator_label4  "BearCross"
#property indicator_type4   DRAW_ARROW
#property indicator_color4  clrRed
#property indicator_width4  2

//-------------------- Inputs: MAs --------------------//
input int                InpFastMAPeriod   = 9;                 // Fast MA period
input ENUM_MA_METHOD     InpFastMAMethod   = MODE_EMA;          // Fast MA method
input int                InpSlowMAPeriod   = 21;                // Slow MA period
input ENUM_MA_METHOD     InpSlowMAMethod   = MODE_EMA;          // Slow MA method
input ENUM_APPLIED_PRICE InpAppliedPrice   = PRICE_CLOSE;       // Applied price
//-------------------- Inputs: Alerts -----------------//
input bool   InpAlertOnBarClose  = true;    // Only alert after bar closes
input bool   InpEnablePopup      = true;    // Popup alert
input bool   InpEnableSound      = false;   // Play sound
input string InpSoundFile        = "alert.wav";  // From terminal's Sounds folder
input bool   InpEnablePush       = false;   // Push notification (set up in Options)
input bool   InpEnableEmail      = false;   // Email alert (set up in Options)
input int    InpRealertMinutes   = 0;       // Re-alert delay (0 = no repeat)

//-------------------- Buffers ------------------------//
double g_fastBuf[];   // Fast MA (plotted)
double g_slowBuf[];   // Slow MA (plotted)
double g_bullBuf[];   // Bull cross arrows
double g_bearBuf[];   // Bear cross arrows

//-------------------- MA handles ---------------------//
int g_fastHandle = INVALID_HANDLE;
int g_slowHandle = INVALID_HANDLE;

//-------------------- De-dup state -------------------//
static datetime g_lastAlertBarTime = 0;
static int      g_lastAlertDir     = 0;   // +1 bull, -1 bear
static datetime g_lastAlertClock   = 0;

//-------------------- Helpers ------------------------//
void SendSignalAlert(const string dir, const double price, const datetime t)
{
   const string sym    = _Symbol;
   const string tf     = EnumToString((ENUM_TIMEFRAMES)Period());
   const string ts     = TimeToString(t, TIME_DATE | TIME_MINUTES);
   const int    digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
   const string pstr   = DoubleToString(price, digits);

   const string msg = StringFormat("[MA Cross] %s on %s (%s) @ %s  [%s]",
                                   dir, sym, tf, pstr, ts);

   if(InpEnablePopup)  Alert(msg);
   if(InpEnableSound)  PlaySound(InpSoundFile);
   if(InpEnablePush)   SendNotification(msg);
   if(InpEnableEmail)  SendMail("MA Cross Alert", msg);
}

bool IsNewOrAllowedRepeat(const int dir, const datetime barTime)
{
   if(barTime != g_lastAlertBarTime || dir != g_lastAlertDir)
      return(true);

   if(InpRealertMinutes > 0)
      return( (TimeCurrent() - g_lastAlertClock) >= (InpRealertMinutes * 60) );

   return(false);
}

void RememberAlert(const int dir, const datetime barTime)
{
   g_lastAlertDir     = dir;
   g_lastAlertBarTime = barTime;
   g_lastAlertClock   = TimeCurrent();
}

//+------------------------------------------------------------------+
//| OnInit                                                           |
//+------------------------------------------------------------------+
int OnInit()
{
   //--- attach buffers
   SetIndexBuffer(0, g_fastBuf, INDICATOR_DATA);
   SetIndexBuffer(1, g_slowBuf, INDICATOR_DATA);
   SetIndexBuffer(2, g_bullBuf, INDICATOR_DATA);
   SetIndexBuffer(3, g_bearBuf, INDICATOR_DATA);

   ArraySetAsSeries(g_fastBuf, true);
   ArraySetAsSeries(g_slowBuf, true);
   ArraySetAsSeries(g_bullBuf, true);
   ArraySetAsSeries(g_bearBuf, true);

   //--- arrow shapes
   PlotIndexSetInteger(2, PLOT_ARROW, 241); // up triangle
   PlotIndexSetInteger(3, PLOT_ARROW, 242); // down triangle

   // (Do NOT write to buffers here; they are sized in OnCalculate)

   //--- create MA handles
   g_fastHandle = iMA(_Symbol, _Period, InpFastMAPeriod, 0, InpFastMAMethod, InpAppliedPrice);
   g_slowHandle = iMA(_Symbol, _Period, InpSlowMAPeriod, 0, InpSlowMAMethod, InpAppliedPrice);
   if(g_fastHandle==INVALID_HANDLE || g_slowHandle==INVALID_HANDLE)
   {
      Print("Failed to create iMA handles. Check inputs.");
      return(INIT_FAILED);
   }
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| OnDeinit                                                         |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   if(g_fastHandle!=INVALID_HANDLE) IndicatorRelease(g_fastHandle);
   if(g_slowHandle!=INVALID_HANDLE) IndicatorRelease(g_slowHandle);
}

//+------------------------------------------------------------------+
//| OnCalculate                                                      |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
   const int need = MathMax(InpFastMAPeriod, InpSlowMAPeriod) + 3;
   if(rates_total < need) return(prev_calculated);

   //--- fill our MA buffers for plotting / logic
   if(CopyBuffer(g_fastHandle, 0, 0, rates_total, g_fastBuf) <= 0) return(prev_calculated);
   if(CopyBuffer(g_slowHandle, 0, 0, rates_total, g_slowBuf) <= 0) return(prev_calculated);

   //--- clear a small front window of arrows (avoid stale marks)
   int start = (prev_calculated > 0) ? prev_calculated - 1 : need - 1;
   if(start < 2) start = 2;
   if(start > rates_total-1) start = rates_total-1;

   for(int i=0; i<start && i<rates_total; i++)
   {
      g_bullBuf[i] = EMPTY_VALUE;
      g_bearBuf[i] = EMPTY_VALUE;
   }

   //--- historical marks (no alerts)
   for(int i=start; i<rates_total-1; i++)
   {
      const double prevDiff = g_fastBuf[i+1] - g_slowBuf[i+1];
      const double curDiff  = g_fastBuf[i]   - g_slowBuf[i];

      if(prevDiff <= 0.0 && curDiff > 0.0)      g_bullBuf[i] = g_fastBuf[i]; // Bull cross
      else if(prevDiff >= 0.0 && curDiff < 0.0) g_bearBuf[i] = g_fastBuf[i]; // Bear cross
   }

   //--- live alert logic
   const int signalBar = (InpAlertOnBarClose ? 1 : 0);
   if(signalBar+1 >= rates_total) return(rates_total);

   const double prevDiff = g_fastBuf[signalBar+1] - g_slowBuf[signalBar+1];
   const double curDiff  = g_fastBuf[signalBar]   - g_slowBuf[signalBar];

   if(prevDiff <= 0.0 && curDiff > 0.0) // Bull
   {
      if(IsNewOrAllowedRepeat(+1, time[signalBar]))
      {
         g_bullBuf[signalBar] = g_fastBuf[signalBar];
         SendSignalAlert("Bullish Cross", g_fastBuf[signalBar], time[signalBar]);
         RememberAlert(+1, time[signalBar]);
      }
   }
   else if(prevDiff >= 0.0 && curDiff < 0.0) // Bear
   {
      if(IsNewOrAllowedRepeat(-1, time[signalBar]))
      {
         g_bearBuf[signalBar] = g_fastBuf[signalBar];
         SendSignalAlert("Bearish Cross", g_fastBuf[signalBar], time[signalBar]);
         RememberAlert(-1, time[signalBar]);
      }
   }

   return(rates_total);
}
//+------------------------------------------------------------------+

