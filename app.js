const ranges = {
  30: { revenue: 68420, customers: 161, conversion: 8.1, aov: 146, revenueTrend: 16.8, customerTrend: 10.4, conversionTrend: 1.5, aovTrend: 7.2 },
  90: { revenue: 184620, customers: 428, conversion: 7.8, aov: 142, revenueTrend: 18.4, customerTrend: 12.1, conversionTrend: 1.3, aovTrend: 8.7 },
  180: { revenue: 351840, customers: 812, conversion: 7.5, aov: 139, revenueTrend: 14.9, customerTrend: 11.2, conversionTrend: 0.9, aovTrend: 6.8 },
  365: { revenue: 694220, customers: 1658, conversion: 7.2, aov: 136, revenueTrend: 21.6, customerTrend: 17.4, conversionTrend: 1.1, aovTrend: 9.4 }
};

const services = [
  { name: 'Strategy & Advisory', revenue: 52480, orders: 224, avg: 234, growth: 24.1, share: 28.4 },
  { name: 'Website Design', revenue: 41860, orders: 31, avg: 1350, growth: 18.7, share: 22.7 },
  { name: 'Analytics & Reporting', revenue: 34820, orders: 86, avg: 405, growth: 21.3, share: 18.9 },
  { name: 'Operations Support', revenue: 29640, orders: 183, avg: 162, growth: 9.6, share: 16.1 },
  { name: 'Automation Projects', revenue: 25820, orders: 44, avg: 587, growth: 15.4, share: 14.0 }
];

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#102238', padding: 10, cornerRadius: 8, titleFont: { family: 'DM Sans' }, bodyFont: { family: 'DM Sans' } } },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { color: '#8b97a4', font: { size: 10, family: 'DM Sans' } } },
    y: { grid: { color: '#edf1f5' }, border: { display: false }, ticks: { color: '#8b97a4', font: { size: 10, family: 'DM Sans' }, callback: value => '$' + (value / 1000) + 'k' } }
  }
};

const revenueChart = new Chart(document.getElementById('revenueChart'), {
  type: 'line',
  data: {
    labels: ['Jun 10','Jun 24','Jul 8','Jul 22','Aug 5','Aug 19','Sep 2'],
    datasets: [
      { label: 'Current', data: [19,22,24,23,29,31,36], borderColor: '#2f7f73', backgroundColor: 'rgba(47,127,115,.08)', borderWidth: 2.5, tension: .4, fill: true, pointRadius: 0, pointHoverRadius: 4 },
      { label: 'Previous', data: [18,19,21,20,23,25,27], borderColor: '#cbd4dd', borderWidth: 2, tension: .4, borderDash: [5,5], pointRadius: 0 }
    ]
  },
  options: chartDefaults
});

const channelColors = ['#2f7f73','#6f9e97','#9ebcb7','#c79b53','#d9dfe5'];
const channelData = [
  { name: 'Organic search', value: 36 },
  { name: 'Referrals', value: 24 },
  { name: 'Paid social', value: 18 },
  { name: 'Email', value: 14 },
  { name: 'Other', value: 8 }
];

new Chart(document.getElementById('channelChart'), {
  type: 'doughnut',
  data: { labels: channelData.map(d => d.name), datasets: [{ data: channelData.map(d => d.value), backgroundColor: channelColors, borderWidth: 0, hoverOffset: 4 }] },
  options: { responsive:true, maintainAspectRatio:false, cutout:'72%', plugins:{ legend:{display:false}, tooltip:{backgroundColor:'#102238',callbacks:{label:ctx=>`${ctx.label}: ${ctx.raw}%`}} } }
});

document.getElementById('channelList').innerHTML = channelData.map((d,i) => `
  <div class="channel-row"><span class="channel-dot" style="background:${channelColors[i]}"></span><span>${d.name}</span><strong>${d.value}%</strong></div>
`).join('');

new Chart(document.getElementById('customerChart'), {
  type: 'bar',
  data: { labels:['Apr','May','Jun','Jul','Aug','Sep'], datasets:[{ data:[242,278,309,351,388,428], backgroundColor:['#dce8e6','#dce8e6','#c8dbd8','#9fc2bc','#6d9f97','#2f7f73'], borderRadius:7, borderSkipped:false }] },
  options: { ...chartDefaults, scales: { x: chartDefaults.scales.x, y: { ...chartDefaults.scales.y, ticks: { ...chartDefaults.scales.y.ticks, callback:value=>value } } } }
});

function formatCurrency(n) { return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n); }

function renderTable(rows = services) {
  document.getElementById('serviceTableBody').innerHTML = rows.map(row => `
    <tr>
      <td class="service-name">${row.name}</td>
      <td>${formatCurrency(row.revenue)}</td>
      <td>${row.orders}</td>
      <td>${formatCurrency(row.avg)}</td>
      <td class="growth-positive">+${row.growth}%</td>
      <td><div class="share-bar"><span style="width:${Math.max(row.share * 2.2, 12)}px"></span>${row.share}%</div></td>
    </tr>
  `).join('');
}
renderTable();

function renderSparks() {
  const sets = {
    sparkRevenue:[38,44,49,45,58,63,76,82,88,96],
    sparkCustomers:[35,39,45,52,49,61,67,73,81,89],
    sparkConversion:[44,46,42,51,55,59,57,63,68,72],
    sparkAov:[31,36,42,47,45,52,58,64,70,78]
  };
  Object.entries(sets).forEach(([id,vals]) => {
    document.getElementById(id).innerHTML = vals.map(v => `<i style="height:${v}%"></i>`).join('');
  });
}
renderSparks();

const toast = document.getElementById('toast');
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function updateRange(days) {
  const d = ranges[days];
  document.getElementById('revenueValue').textContent = formatCurrency(d.revenue);
  document.getElementById('customersValue').textContent = d.customers.toLocaleString();
  document.getElementById('conversionValue').textContent = d.conversion + '%';
  document.getElementById('aovValue').textContent = formatCurrency(d.aov);
  document.getElementById('revenueTrend').textContent = '+' + d.revenueTrend + '%';
  document.getElementById('customersTrend').textContent = '+' + d.customerTrend + '%';
  document.getElementById('conversionTrend').textContent = '+' + d.conversionTrend + '%';
  document.getElementById('aovTrend').textContent = '+' + d.aovTrend + '%';
  showToast(`Dashboard updated to ${days === '365' ? '12 months' : days === '180' ? '6 months' : days + ' days'}`);
}

document.getElementById('dateRange').addEventListener('change', e => updateRange(e.target.value));

document.getElementById('serviceSearch').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  renderTable(services.filter(s => s.name.toLowerCase().includes(q)));
});

function downloadFile(filename, content, type='text/csv') {
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('downloadCsv').addEventListener('click', () => {
  const csv = ['Service,Revenue,Orders,Average Value,Growth,Share', ...services.map(s => `"${s.name}",${s.revenue},${s.orders},${s.avg},${s.growth},${s.share}`)].join('\n');
  downloadFile('northstar-service-performance.csv', csv);
  showToast('CSV downloaded');
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const selected = document.getElementById('dateRange').value;
  const d = ranges[selected];
  const report = `NORTHSTAR ANALYTICS - EXECUTIVE REPORT\n\nPeriod: ${selected} days\nRevenue: ${formatCurrency(d.revenue)}\nNew Customers: ${d.customers}\nConversion Rate: ${d.conversion}%\nAverage Order Value: ${formatCurrency(d.aov)}\n\nKey Insight: Retention is currently the highest-value growth lever.\n\nPortfolio concept designed and developed by Jessica Staats.`;
  downloadFile('northstar-executive-report.txt', report, 'text/plain');
  showToast('Executive report exported');
});

document.getElementById('channelDetailBtn').addEventListener('click', () => showToast('Organic search leads acquisition at 36%'));

document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const labels = {overview:'Business Overview',revenue:'Revenue Performance',customers:'Customer Intelligence',channels:'Acquisition Channels'};
  document.querySelector('.topbar h1').textContent = labels[btn.dataset.section];
  showToast(`${labels[btn.dataset.section]} view selected`);
  if (window.innerWidth < 760) document.getElementById('sidebar').classList.remove('open');
}));

document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

document.addEventListener('click', e => {
  const sidebar = document.getElementById('sidebar');
  const menu = document.getElementById('menuBtn');
  if (window.innerWidth < 760 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !menu.contains(e.target)) sidebar.classList.remove('open');
});
