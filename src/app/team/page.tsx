import type { Metadata } from 'next';
import PageHeader from '@/components/customer/PageHeader';
import SiteFooter from '@/components/customer/SiteFooter';

export const metadata: Metadata = {
  title: "Team — Uncle's Panuozzo & Sandwiches",
  description: 'The family behind Uncle\'s in North Shields.',
};

// Placeholder team content. Replace names, roles, lines (and later photos) with
// the real team once Roma provides them. `initial` drives the monogram avatar.
type Member = {
  name: string;
  role: string;
  line: string;
  initial: string;
  placeholder?: boolean;
};

const TEAM: Member[] = [
  {
    name: 'Roma',
    role: 'Owner',
    line: 'Looking after Uncle\'s, from the morning bake to the counter.',
    initial: 'R',
  },
  {
    name: 'More to come',
    role: 'The family',
    line: 'The rest of the Uncle\'s team, coming soon.',
    initial: '◆',
    placeholder: true,
  },
];

export default function TeamPage() {
  return (
    <main className="stage">
      <PageHeader marker="Team" />

      <div className="section-band">
        <span className="section-line left" />
        <span className="section-band-diamond">◆</span>
        <span className="section-title">Our Team</span>
        <span className="section-band-diamond">◆</span>
        <span className="section-line right" />
      </div>

      <div className="prose">
        <p>
          Uncle&apos;s is family-run. The same hands bake the bread each morning, pull the coffee,
          and look after the counter through the day.
        </p>
      </div>

      <div className="team">
        {TEAM.map((member) => (
          <div
            className={`team-card${member.placeholder ? ' placeholder' : ''}`}
            key={member.name}
          >
            <div className="team-avatar">{member.initial}</div>
            <div>
              <div className="team-name">{member.name}</div>
              <div className="team-role">{member.role}</div>
              <div className="team-line">{member.line}</div>
            </div>
          </div>
        ))}
      </div>

      <SiteFooter
        links={[
          { href: '/', label: 'Menu' },
          { href: '/about', label: 'About' },
          { href: '/contact', label: 'Contact' },
        ]}
      />
    </main>
  );
}
