// src/lib/client.ts

export function showToast(
  message: string,
  type: "success" | "error" = "success",
) {
  const toast = document.createElement("div");
  const bgColor = type === "error" ? "bg-red-600" : "bg-gray-900";

  toast.className = `fixed top-[70px] right-6 ${bgColor} text-white px-6 py-3 rounded-lg shadow-2xl z-50 transition-all duration-300`;
  toast.style.opacity = "0";
  toast.style.transform = "translateY(-10px)";

  toast.innerHTML = `
    <span class="mr-2 font-bold">${type === "error" ? "❌" : "✓"}</span>
    ${message}
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Disalin ke Clipboard");
  } catch {
    showToast("Gagal menyalin", "error");
  }
}
