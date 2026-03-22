import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function PaymentCancel() {
  const [, navigate] = useLocation();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "oklch(0.975 0.008 80)" }}
    >
      <div className="max-w-lg w-full text-center">
        {/* Cancel icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "oklch(0.55 0.18 25 / 0.10)" }}
        >
          <XCircle size={40} style={{ color: "oklch(0.55 0.18 25)" }} />
        </div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}
        >
          Payment Cancelled
        </h1>

        <p
          className="text-base mb-8 leading-relaxed"
          style={{ color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Your payment was not completed. No charge has been made. You can try again
          or go back to compare quotes from other firms.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1 as any)}
            variant="outline"
            className="flex items-center gap-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/get-quote")}
            className="flex items-center gap-2"
            style={{
              background: "oklch(0.72 0.12 75)",
              color: "oklch(0.12 0.05 250)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <RefreshCw size={16} />
            Try Again
          </Button>
        </div>

        <p
          className="mt-6 text-xs"
          style={{ color: "oklch(0.55 0.08 250)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Need help? Call us on{" "}
          <a
            href="tel:03301289488"
            className="font-semibold"
            style={{ color: "oklch(0.72 0.12 75)" }}
          >
            0330 128 9488
          </a>
        </p>
      </div>
    </div>
  );
}
