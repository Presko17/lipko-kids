// Renders a JSON-LD <script> for structured data (schema.org). Server component.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, app-generated content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
