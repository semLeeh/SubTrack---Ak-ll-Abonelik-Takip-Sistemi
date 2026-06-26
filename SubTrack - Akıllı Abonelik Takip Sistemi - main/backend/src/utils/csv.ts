export function generateCSV(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(h => `"${h}"`).join(',');
  const dataLines = rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  );
  return [headerLine, ...dataLines].join('\n');
}

export function subscriptionsToCSV(subscriptions: any[]): string {
  const headers = [
    'Abonelik Adı', 'Sağlayıcı', 'Fiyat', 'Para Birimi',
    'Faturalama Döngüsü', 'Durum', 'Başlangıç Tarihi',
    'Sonraki Faturalama', 'Kategoriler'
  ];

  const rows = subscriptions.map(sub => [
    sub.name,
    sub.provider || '-',
    sub.price.toString(),
    sub.currency,
    sub.billingCycle,
    sub.status,
    new Date(sub.startDate).toLocaleDateString('tr-TR'),
    new Date(sub.nextBillingDate).toLocaleDateString('tr-TR'),
    sub.categories?.map((c: any) => c.category?.name || c.name).join(', ') || '-'
  ]);

  return generateCSV(headers, rows);
}

export function paymentsToCSV(payments: any[]): string {
  const headers = [
    'Abonelik', 'Tutar', 'Para Birimi', 'Durum',
    'Ödeme Tarihi', 'Fatura No'
  ];

  const rows = payments.map(p => [
    p.subscription?.name || '-',
    p.amount.toString(),
    p.currency,
    p.status,
    new Date(p.paidAt).toLocaleDateString('tr-TR'),
    p.invoiceUrl || '-'
  ]);

  return generateCSV(headers, rows);
}
