// src/lib/client.ts

type ToastType = "success" | "error" | "warning" | "default";

interface ToastConfig {
  bg: string;
  border: string;
  icon: string;
}

const TOAST_CONFIG: Record<ToastType, ToastConfig> = {
  success: {
    bg: "bg-emerald-500",
    border: "border-emerald-400/40",
    icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>`,
  },
  error: {
    bg: "bg-red-500",
    border: "border-red-400/40",
    icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>`,
  },
  warning: {
    bg: "bg-amber-500",
    border: "border-amber-300/40",
    icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM10.29 3.86L1.82 18a1.5 1.5 0 001.29 2.25h17.78A1.5 1.5 0 0022.18 18L13.71 3.86a1.5 1.5 0 00-2.42 0z" />
    </svg>`,
  },
  default: {
    bg: "bg-gray-500",
    border: "border-gray-600/40",
    icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`,
  },
};

let toastCount = 0;

export function showToast(message: string, type: ToastType = "default") {
  const { bg, border, icon } = TOAST_CONFIG[type];

  const toast = document.createElement("div");
  const offset = 70 + toastCount * 64; // stack multiple toasts vertically
  toastCount++;

  toast.className = [
    "fixed right-6 z-50",
    "flex items-center gap-3",
    "min-w-[260px] max-w-[380px]",
    "px-4 py-3 rounded-xl border",
    bg,
    border,
    "text-white text-sm font-medium",
    "opacity-50",
    "shadow-lg shadow-black/20",
    "transition-all duration-300 ease-out",
  ].join(" ");

  toast.style.top = `${offset}px`;
  toast.style.opacity = "0";
  toast.style.transform = "translateX(20px)";

  toast.innerHTML = `
    <span class="shrink-0 flex items-center justify-center">${icon}</span>
    <span class="leading-snug">${message}</span>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "0.8";
    toast.style.transform = "translateX(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => {
      toast.remove();
      toastCount = Math.max(0, toastCount - 1);
    }, 300);
  }, 2500);
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Disalin ke clipboard", "success");
  } catch {
    showToast("Gagal menyalin", "error");
  }
}
