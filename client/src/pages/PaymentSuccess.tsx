import { CheckCircle, ArrowRight, Phone } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "oklch(0.975 0.008 80)" }}
    >
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "oklch(0.55 0.18 145 / 0.12)" }}
        >
          <CheckCircle size={40} style={{ color: "oklch(0.55 0.18 145)" }} />
        </div>

        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}
        >
          Payment Successful
        </h1>

        <p
          className="text-base mb-6 leading-relaxed"
          style={{ color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Your initial payment on account has been received. Your chosen conveyancer
          will be in touch within one business day to begin your matter.
        </p>

        <div
          className="rounded-xl p-5 mb-8 text-left"
          style={{
            background: "oklch(0.55 0.18 145 / 0.06)",
            border: "1px solid oklch(0.55 0.18 145 / 0.2)",
          }}
        >
          <h3
            className="font-semibold mb-3 text-sm uppercase tracking-wide"
            style={{ color: "oklch(0.55 0.18 145)", fontFamily: "'DM Sans', sans-serif" }}
          >
            What happens next?
          </h3>
          <ul className="space-y-2">
            {[
              "Your conveyancer will send you a client care letter and ID verification request",
              "You will receive a full breakdown of costs and disbursements",
              "Your matter will be opened and progressed within 1–2 business days",
            ].map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm"
                style={{ color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: "oklch(0.55 0.18 145 / 0.15)", color: "oklch(0.55 0.18 145)" }}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="flex items-center gap-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Return to Home
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
            Get Another Quote
            <ArrowRight size={16} />
          </Button>
        </div>

        <p
          className="mt-6 text-xs"
          style={{ color: "oklch(0.55 0.08 250)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Need help? Call us on{" "}
          <a
            href="tel:02080508050"
            className="font-semibold"
            style={{ color: "oklch(0.72 0.12 75)" }}
          >
            0208 050 8050
          </a>
        </p>
      </div>
    </div>
  );
}
