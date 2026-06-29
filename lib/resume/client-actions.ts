export function printResumeFromUrl(url: string): void {
  const printWindow = window.open(url, "_blank");

  if (!printWindow) {
    window.open(url, "_blank");
    return;
  }

  const triggerPrint = () => {
    printWindow.focus();
    printWindow.print();
  };

  printWindow.addEventListener("load", triggerPrint);
  window.setTimeout(triggerPrint, 1500);
}

export function getPdfEmbedUrl(url: string): string {
  const baseUrl = url.split("#")[0];
  return `${baseUrl}#toolbar=0&navpanes=0`;
}
