import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicDocument } from "@/components/PublicShell";
import { publicPageHead } from "@/lib/page-head";
export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  head: () => publicPageHead("/terms", "Terms of Service — Pulse", "Terms for using Pulse’s free online habit, water and calorie tracker and AI coach, including account responsibilities and wellness guidance limits."),
  component: TermsPage,
});
function TermsPage() {
  return <PublicDocument title="Terms of Service" intro="These terms describe responsible use of Pulse, a free, no-download daily routine tracker with an AI coach. Last updated November 18, 2026.">
    <section><h2>Using Pulse</h2><p>By using Pulse, you agree to these terms. Use the service lawfully, provide accurate account information, and keep your account credentials private. You are responsible for the information and entries you submit. Do not access other people’s records, abuse the AI service, send spam, or attempt to disrupt the website.</p></section>
    <section><h2>Free access and availability</h2><p>Pulse currently provides habit, water and calorie tracking and built-in AI coaching at no extra cost. No download or payment card is required. Features may change, and access may be interrupted for maintenance or service-provider issues. Free access does not guarantee unlimited AI usage or uninterrupted availability. Any future paid offer would require separate, clearly disclosed terms; these terms do not authorize a payment.</p></section>
    <section><h2>Wellness support, not medical care</h2><p>Pulse is a general wellness tool, not a medical device, diet prescription, or substitute for qualified professional care. AI replies can be inaccurate or incomplete. Water and calorie goals are estimates you choose, not universal targets. Homepage goals and coach replies are illustrative examples. Consider your needs, hunger and health circumstances, and consult a qualified professional before making important health or dietary changes. Do not use Pulse for emergencies.</p></section>
    <section><h2>Your entries and AI conversations</h2><p>You retain responsibility for your content. You allow Pulse and its service providers to process your submissions as needed to save records and generate requested replies, as explained in our <Link to="/privacy">Privacy Policy</Link>. Do not submit content you have no right to share. You can remove individual saved conversations in the app.</p></section>
    <section><h2>Service limitations</h2><p>Pulse is provided on an as-available basis. We do not promise particular health outcomes, error-free AI responses, or permanent availability. To the extent allowed by applicable law, Pulse is not responsible for losses arising from reliance on inaccurate entries or AI guidance. Nothing here limits rights or protections that applicable law does not allow to be excluded.</p></section>
    <section><h2>Questions and account requests</h2><p>Use <Link to="/contact">Contact / Feedback</Link> for questions, feedback or account privacy requests. Sending a message does not guarantee an immediate reply. We may update these terms when the service changes and will update the date on this page.</p></section>
  </PublicDocument>;
}