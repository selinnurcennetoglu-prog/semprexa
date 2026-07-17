import crypto from "crypto";

const MERCHANT_ID = process.env.PAYTR_MERCHANT_ID || "";
const MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY || "";
const MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || "";
const PAYTR_API = "https://www.paytr.com/odeme/api/get-token";
const PAYTR_3D_URL = "https://www.paytr.com/odeme/guvenli";

interface PaytrOrder {
  userIp: string;
  merchantOid: string;
  email: string;
  paymentAmount: number; // kuruş cinsinden
  paytrToken: string;
  userBasket: string;
  debugOn: number;
  noInstallment: number;
  maxInstallment: number;
  userFullName: string;
  userAddress: string;
  userPhone: string;
  merchantName: string;
  merchantOkUrl: string;
  merchantFailUrl: string;
  timeoutLimit: number;
  currency: string;
  testMode: number;
}

function generateBasket(items: { name: string; price: number; quantity: number }[]): string {
  const basket = items.map(item => [
    item.name,
    (item.price * 100).toString(), // kuruş
    item.quantity.toString(),
  ]);
  return Buffer.from(JSON.stringify(basket)).toString("base64");
}

function generateHash(oid: string, email: string, amount: number, basket: string): string {
  const hashStr = [MERCHANT_ID, oid, email, amount.toString(), "", "", "", "TL", ""].join("");
  const hmac = crypto.createHmac("sha256", MERCHANT_KEY);
  hmac.update(hashStr + MERCHANT_SALT);
  return hmac.digest("base64");
}

export async function createPaytrToken(params: {
  userIp: string;
  email: string;
  total: number;
  items: { name: string; price: number; quantity: number }[];
  userName: string;
  userAddress: string;
  userPhone: string;
  merchantOid: string;
}): Promise<{ token: string; threeDsUrl: string } | { error: string }> {
  try {
    const amount = Math.round(params.total); // kuruş cinsinden
    const basket = generateBasket(params.items);

    const formData = new URLSearchParams();
    formData.append("merchant_id", MERCHANT_ID);
    formData.append("user_ip", params.userIp);
    formData.append("merchant_oid", params.merchantOid);
    formData.append("email", params.email);
    formData.append("payment_amount", amount.toString());
    formData.append("paytr_token", generateHash(params.merchantOid, params.email, amount, basket));
    formData.append("user_basket", basket);
    formData.append("debug_on", "1");
    formData.append("no_installment", "1");
    formData.append("max_installment", "0");
    formData.append("user_fullname", params.userName);
    formData.append("user_address", params.userAddress);
    formData.append("user_phone", params.userPhone);
    formData.append("merchant_name", "Semprexa");
    formData.append("merchant_ok_url", `${process.env.NEXT_PUBLIC_SITE_URL || "https://semprexa-ec48-two.vercel.app"}/odeme/basarili?oid=${params.merchantOid}`);
    formData.append("merchant_fail_url", `${process.env.NEXT_PUBLIC_SITE_URL || "https://semprexa-ec48-two.vercel.app"}/odeme/basarisiz?oid=${params.merchantOid}`);
    formData.append("timeout_limit", "30");
    formData.append("currency", "TL");
    formData.append("test_mode", "1"); // Test modunda

    const res = await fetch(PAYTR_API, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await res.json();
    if (data.status === "success" && data.token) {
      return {
        token: data.token,
        threeDsUrl: `${PAYTR_3D_URL}/${data.token}`,
      };
    }

    return { error: data.reason || "PayTR token alinamadi" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "PayTR baglanti hatasi" };
  }
}

export function verifyPaytrCallback(params: { merchant_oid: string; status: string; total_amount: string; hash: string }): boolean {
  const hashStr = [MERCHANT_ID, params.merchant_oid, MERCHANT_SALT, params.status, params.total_amount].join("");
  const expectedHash = crypto.createHmac("sha256", MERCHANT_KEY).update(hashStr).digest("base64");
  return expectedHash === params.hash;
}
