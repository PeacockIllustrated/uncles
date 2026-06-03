import { getMenu } from '@/lib/menu';
import { formatPrice } from '@/lib/format';
import type { MenuSection } from '@/lib/types';

function SectionBand({ title, tagline }: { title: string; tagline?: string | null }) {
  return (
    <>
      <div className="section-band">
        <span className="section-line left" />
        <span className="section-band-diamond">◆</span>
        <span className="section-title">{title}</span>
        <span className="section-band-diamond">◆</span>
        <span className="section-line right" />
      </div>
      {tagline ? <p className="section-tagline">{tagline}</p> : null}
    </>
  );
}

// Signature Panuozzi: two-size rows, with the Dolce feature band rendered from
// the section's is_feature item (Nutella / Pistachio).
function PanuozziSection({ section }: { section: MenuSection }) {
  const rows = section.items.filter((i) => !i.is_feature);
  const dolce = section.items.find((i) => i.is_feature);

  return (
    <>
      <div className="panuozzi">
        {rows.map((item) => (
          <article className="pan-row" key={item.slug}>
            <div className="pan-name">{item.name}</div>
            {item.description ? <p className="pan-desc">{item.description}</p> : null}
            <div className="pan-prices">
              {item.sizes.map((size) => (
                <div className="pan-size" key={size.size_label ?? 'single'}>
                  <div className="pan-size-label">{size.size_label}</div>
                  <div className="pan-size-price">{formatPrice(size.price_pence)}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {dolce ? (
        <div className="dolce">
          {dolce.description ? <div className="dolce-eyebrow">{dolce.description}</div> : null}
          <div className="dolce-name">{dolce.name}</div>
          <div className="dolce-divider" />
          <div className="dolce-options">
            {dolce.sizes.map((size) => (
              <div className="dolce-row" key={size.size_label ?? 'single'}>
                <div className="dolce-flavour">{size.size_label}</div>
                <div className="dolce-desc">{size.note}</div>
                <div className="dolce-price">{formatPrice(size.price_pence)}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

// Coffee, Bakery, Water & Drinks. Consolidated rows (with a middot) render a
// touch smaller, matching the reference's ".group" treatment.
function ListSection({ section }: { section: MenuSection }) {
  return (
    <div className="list">
      {section.items.map((item) => (
        <div className={`list-row${item.name.includes('·') ? ' group' : ''}`} key={item.slug}>
          <span className="list-name">{item.name}</span>
          <span className="list-price">{formatPrice(item.sizes[0].price_pence)}</span>
        </div>
      ))}
    </div>
  );
}

// Extras: single-column list. Most items carry Classico/Grande prices; the
// combined veg row has a single price and reads as a quieter footnote.
function ExtrasSection({ section }: { section: MenuSection }) {
  return (
    <div className="extras">
      {section.items.map((item) => {
        const dual = item.sizes.length > 1;
        return (
          <div className={`extras-row${dual ? '' : ' combined'}`} key={item.slug}>
            <span className="extras-name">{item.name}</span>
            <span className="extras-prices">
              {item.sizes.map((size) => (
                <span className="extras-pair" key={size.size_label ?? 'single'}>
                  {size.size_label ? (
                    <span className="extras-size">{size.size_label.charAt(0)}</span>
                  ) : null}
                  <span className="extras-price">{formatPrice(size.price_pence)}</span>
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Desserts: bordered feature cards. An optional size note (e.g. "15 cm") shows
// as a small badge beside the name.
function DessertsSection({ section }: { section: MenuSection }) {
  return (
    <div className="desserts">
      {section.items.map((item) => {
        const note = item.sizes[0]?.note;
        return (
          <div className="dessert-card" key={item.slug}>
            <div className="dessert-row">
              <span className="dessert-name">
                {item.name}
                {note ? <span className="dessert-note">{note}</span> : null}
              </span>
              <span className="dessert-price">{formatPrice(item.sizes[0].price_pence)}</span>
            </div>
            {item.description ? <div className="dessert-desc">{item.description}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

function SectionBody({ section }: { section: MenuSection }) {
  if (section.slug === 'panuozzi') return <PanuozziSection section={section} />;
  if (section.layout_hint === 'grid') return <ExtrasSection section={section} />;
  if (section.layout_hint === 'feature') return <DessertsSection section={section} />;
  return <ListSection section={section} />;
}

// Server component — fetches the menu once and renders every section.
export default async function Menu() {
  const sections = await getMenu();
  return (
    <>
      {sections.map((section) => (
        <section key={section.slug}>
          <SectionBand title={section.title} tagline={section.tagline} />
          <SectionBody section={section} />
        </section>
      ))}
    </>
  );
}
