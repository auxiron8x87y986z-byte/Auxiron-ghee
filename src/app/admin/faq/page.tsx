import { getFAQs } from "@/app/actions/faq";
import FAQClient from "./FAQClient";

export const metadata = {
  title: "Manage FAQs | Auxiron Admin",
};

export default async function AdminFAQPage() {
  const { faqs } = await getFAQs();

  return <FAQClient initialFaqs={faqs || []} />;
}
