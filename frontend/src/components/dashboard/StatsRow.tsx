// src/components/dashboard/StatsRow.tsx
'use client';
import { Stat, Pnl } from '../ui';

export default function StatsRow({ state, tradeStats }: { state: any; tradeStats: any }) {
  const bal       = state?.balance;
  const equity    = parseFloat(bal?.equity    || 0);
  const available = parseFloat(bal?.available || 0);
  const upnl      = parseFloat(bal?.upnl      || 0);
  const totalFees = parseFloat(bal?.totalFees || 0);
  const dailyPnl  = parseFloat(tradeStats?.today?.pnl || state?.dailyPnl || 0);
  const totalPnl  = parseFloat(tradeStats?.total?.pnl || state?.totalPnl || 0);
  const today     = tradeStats?.today || {};
  const total     = tradeStats?.total || {};

  // Capital deployed = from config
  const capital   = parseFloat(state?.config?.capital || 250);
  const leverage  = parseInt(state?.config?.leverage  || 10);
  const deployed  = capital * leverage;

  // ROI = totalPnl / capital * 100
  const roi       = capital > 0 ? (totalPnl / capital * 100) : 0;
  const dailyRoi  = capital > 0 ? (dailyPnl / capital * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Row 1 — Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat
          label="Account Equity"
          value={`$${equity.toFixed(2)}`}
          sub={<span className={upnl >= 0 ? 'pos' : 'neg'}>{upnl >= 0 ? '+' : ''}${upnl.toFixed(2)} unrealized</span>}
          color="text-text"
        />
        <Stat
          label="Today PnL"
          value={<Pnl v={dailyPnl} />}
          sub={`${today.trades || 0} fills · ${dailyRoi >= 0 ? '+' : ''}${dailyRoi.toFixed(2)}% ROI`}
          color={dailyPnl >= 0 ? 'text-accent' : 'text-danger'}
        />
        <Stat
          label="Total PnL"
          value={<Pnl v={totalPnl} />}
          sub={`${total.trades || 0} fills · ${roi >= 0 ? '+' : ''}${roi.toFixed(2)}% ROI`}
          color={totalPnl >= 0 ? 'text-accent' : 'text-danger'}
        />
        <Stat
          label="Grid Orders"
          value={state?.openOrders || 0}
          sub={`${state?.levels || 0} levels active`}
          color="text-info"
        />
      </div>

      {/* Row 2 — Capital Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat
          label="Capital Deployed"
          value={`$${capital.toFixed(2)}`}
          sub={`${leverage}x leverage = $${deployed.toFixed(0)} exposure`}
          color="text-warning"
        />
        <Stat
          label="Available Balance"
          value={`$${available.toFixed(2)}`}
          sub="Free USDT"
          color="text-text"
        />
        <Stat
          label="Fees Paid"
          value={`$${totalFees.toFixed(4)}`}
          sub="0.055% per fill"
          color="text-danger"
        />
        <Stat
          label="Net Profit"
          value={<Pnl v={totalPnl - totalFees} />}
          sub="After fees"
          color={(totalPnl - totalFees) >= 0 ? 'text-accent' : 'text-danger'}
        />
      </div>
    </div>
  );
}
