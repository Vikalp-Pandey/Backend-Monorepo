import React from 'react';

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

const brand = {
  bg: '#faf8f4',
  card: '#ffffff',
  primary: '#1c1a17',
  gold: '#c8a84b',
  border: '#d4cfc5',
  text: '#1c1a17',
  muted: '#7a7468',
  mutedLight: '#9a9288',
  logoUrl: 'https://nordmatengros.com/logo.png',
};

function EmailWrapper({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <Tailwind>
      <Html lang="nb">
        <Head />
        <Preview>{preview}</Preview>
        <Body
          style={{
            backgroundColor: brand.bg,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            margin: 0,
            padding: 0,
          }}
        >
          <Container
            style={{
              maxWidth: '580px',
              margin: '0 auto',
              paddingTop: '40px',
              paddingBottom: '48px',
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Img
                src={brand.logoUrl}
                alt="Nordmat Engros"
                width={140}
                style={{ margin: '0 auto', display: 'block' }}
              />
            </Section>

            <Section
              style={{
                backgroundColor: brand.card,
                borderRadius: '16px',
                border: `1px solid ${brand.border}`,
                padding: '40px 48px',
                boxShadow: '0 2px 8px rgba(28,26,23,0.06)',
              }}
            >
              {children}
            </Section>

            <Section style={{ paddingLeft: '48px', paddingRight: '48px' }}>
              <Text
                style={{
                  marginTop: '32px',
                  textAlign: 'center',
                  fontSize: '11px',
                  lineHeight: '1.6',
                  color: brand.mutedLight,
                }}
              >
                Nordmat Engros AS · Grossistportal for næringslivet
                <br />© {new Date().getFullYear()} Nordmat Engros. Alle
                rettigheter forbeholdt.
              </Text>
              <Text
                style={{
                  marginTop: '8px',
                  textAlign: 'center',
                  fontSize: '11px',
                  color: brand.mutedLight,
                }}
              >
                Har du spørsmål? Kontakt oss på{' '}
                <a
                  href="mailto:support@nordmatengros.no"
                  style={{ color: brand.gold, textDecoration: 'none' }}
                >
                  support@nordmatengros.no
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

function AccentBar() {
  return (
    <div
      style={{
        height: '3px',
        width: '40px',
        backgroundColor: brand.gold,
        borderRadius: '999px',
        margin: '16px 0 24px',
      }}
    />
  );
}

function ActionButton({ href, label }: { href: string; label: string }) {
  return (
    <Section style={{ margin: '32px 0', textAlign: 'center' }}>
      <Button
        href={href}
        style={{
          display: 'inline-block',
          backgroundColor: brand.primary,
          color: '#ffffff',
          fontSize: '15px',
          fontWeight: '600',
          textDecoration: 'none',
          borderRadius: '10px',
          padding: '14px 32px',
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </Button>
    </Section>
  );
}

function FallbackLink({ url }: { url: string }) {
  return (
    <>
      <Text
        style={{
          fontSize: '13px',
          lineHeight: '1.6',
          color: brand.muted,
          marginBottom: '8px',
        }}
      >
        Hvis knappen ikke fungerer, kopier og lim inn lenken nedenfor i
        nettleseren:
      </Text>
      <div
        style={{
          backgroundColor: brand.bg,
          border: `1px solid ${brand.border}`,
          borderRadius: '10px',
          padding: '14px 16px',
          marginBottom: '24px',
          wordBreak: 'break-all',
        }}
      >
        <Text
          style={{
            margin: 0,
            fontFamily: 'monospace',
            fontSize: '12px',
            color: brand.text,
          }}
        >
          {url}
        </Text>
      </div>
    </>
  );
}

interface EmailVerificationProps {
  url: string;
  name: string;
}

export function EmailVerification(props: EmailVerificationProps) {
  return (
    <EmailWrapper preview="Bekreft e-postadressen din – Nordmat Engros">
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          letterSpacing: '-0.025em',
          color: brand.text,
          marginBottom: '4px',
        }}
      >
        Bekreft e-postadressen din
      </Text>
      <AccentBar />

      <Text
        style={{
          fontSize: '15px',
          lineHeight: '1.7',
          color: brand.text,
          marginBottom: '8px',
        }}
      >
        Hei {props.name},
      </Text>

      <Text
        style={{
          fontSize: '15px',
          lineHeight: '1.7',
          color: brand.muted,
          marginBottom: '0',
        }}
      >
        Takk for at du registrerte deg hos Nordmat Engros! For å fullføre
        kontooppsettet og få tilgang til grossistportalen, vennligst bekreft
        e-postadressen din ved å klikke på knappen nedenfor.
      </Text>

      <ActionButton href={props.url} label="Bekreft e-postadresse" />

      <Text
        style={{
          fontSize: '13px',
          lineHeight: '1.6',
          color: brand.muted,
          marginBottom: '16px',
        }}
      >
        Denne lenken utløper om{' '}
        <strong style={{ color: brand.text }}>1 time</strong>.
      </Text>

      <FallbackLink url={props.url} />

      <Hr style={{ borderColor: brand.border, margin: '24px 0' }} />

      <Text
        style={{
          fontSize: '12px',
          lineHeight: '1.6',
          color: brand.mutedLight,
          margin: '0',
        }}
      >
        Hvis du ikke opprettet en konto hos Nordmat Engros, kan du trygt se bort
        fra denne e-posten.
      </Text>
    </EmailWrapper>
  );
}

interface ResetPasswordProps {
  url: string;
  name: string;
}

export function ResetPassword(props: ResetPasswordProps) {
  return (
    <EmailWrapper preview="Tilbakestill passordet ditt – Nordmat Engros">
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          letterSpacing: '-0.025em',
          color: brand.text,
          marginBottom: '4px',
        }}
      >
        Tilbakestill passordet ditt
      </Text>
      <AccentBar />

      <Text
        style={{
          fontSize: '15px',
          lineHeight: '1.7',
          color: brand.text,
          marginBottom: '8px',
        }}
      >
        Hei {props.name},
      </Text>

      <Text
        style={{
          fontSize: '15px',
          lineHeight: '1.7',
          color: brand.muted,
          marginBottom: '0',
        }}
      >
        Vi mottok en forespørsel om å tilbakestille passordet for din Nordmat
        Engros-konto. Klikk på knappen nedenfor for å velge et nytt passord.
      </Text>

      <ActionButton href={props.url} label="Tilbakestill passord" />

      <Text
        style={{
          fontSize: '13px',
          lineHeight: '1.6',
          color: brand.muted,
          marginBottom: '16px',
        }}
      >
        Denne lenken utløper om{' '}
        <strong style={{ color: brand.text }}>1 time</strong> av
        sikkerhetsmessige årsaker.
      </Text>

      <FallbackLink url={props.url} />

      <Hr style={{ borderColor: brand.border, margin: '24px 0' }} />

      <Text
        style={{
          fontSize: '12px',
          lineHeight: '1.6',
          color: brand.mutedLight,
          margin: '0',
        }}
      >
        Hvis du ikke ba om tilbakestilling av passord, kan du trygt se bort fra
        denne e-posten. Passordet ditt forblir uendret.
      </Text>
    </EmailWrapper>
  );
}

interface AccountApprovedProps {
  name: string;
  email: string;
  loginUrl: string;
}

export function AccountApproved(props: AccountApprovedProps) {
  return (
    <EmailWrapper preview="Kontoen din er godkjent – Nordmat Engros">
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          letterSpacing: '-0.025em',
          color: brand.text,
          marginBottom: '4px',
        }}
      >
        Kontoen din er godkjent!
      </Text>
      <AccentBar />

      <Text
        style={{
          fontSize: '15px',
          lineHeight: '1.7',
          color: brand.text,
          marginBottom: '8px',
        }}
      >
        Hei {props.name},
      </Text>

      <Text
        style={{
          fontSize: '15px',
          lineHeight: '1.7',
          color: brand.muted,
          marginBottom: '0',
        }}
      >
        Vi er glade for å informere deg om at kontoen din hos Nordmat Engros nå
        er godkjent. Du kan logge inn og begynne å bruke grossistportalen vår
        umiddelbart.
      </Text>

      <div
        style={{
          backgroundColor: brand.bg,
          border: `1px solid ${brand.border}`,
          borderRadius: '10px',
          padding: '16px 20px',
          margin: '24px 0',
        }}
      >
        <Text
          style={{
            margin: '0 0 4px',
            fontSize: '12px',
            fontWeight: '600',
            color: brand.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Din e-postadresse
        </Text>
        <Text
          style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: '600',
            color: brand.text,
          }}
        >
          {props.email}
        </Text>
      </div>

      <ActionButton href={props.loginUrl} label="Logg inn nå" />

      <Hr style={{ borderColor: brand.border, margin: '24px 0' }} />

      <Text
        style={{
          fontSize: '12px',
          lineHeight: '1.6',
          color: brand.mutedLight,
          margin: '0',
        }}
      >
        Hvis du har spørsmål om kontoen din, ta kontakt med oss på{' '}
        <a
          href="mailto:support@nordmatengros.no"
          style={{ color: brand.gold, textDecoration: 'none' }}
        >
          support@nordmatengros.no
        </a>
        .
      </Text>
    </EmailWrapper>
  );
}

interface AccountCreatedProps {
  name: string;
  email: string;
  password: string;
  loginUrl: string;
}

export function AccountCreated(props: AccountCreatedProps) {
  return (
    <EmailWrapper preview="Kontoen din er opprettet – Nordmat Engros">
      <Text
        style={{
          fontSize: '22px',
          fontWeight: '700',
          letterSpacing: '-0.025em',
          color: brand.text,
          marginBottom: '4px',
        }}
      >
        Velkommen til Nordmat Engros!
      </Text>
      <AccentBar />

      <Text
        style={{
          fontSize: '15px',
          lineHeight: '1.7',
          color: brand.text,
          marginBottom: '8px',
        }}
      >
        Hei {props.name},
      </Text>

      <Text
        style={{
          fontSize: '15px',
          lineHeight: '1.7',
          color: brand.muted,
          marginBottom: '0',
        }}
      >
        En administrator har opprettet en konto for deg i Nordmat Engros
        grossistportal. Nedenfor finner du innloggingsdetaljene dine. Vi
        anbefaler at du endrer passordet ditt etter første innlogging.
      </Text>

      <div
        style={{
          backgroundColor: brand.bg,
          border: `1px solid ${brand.border}`,
          borderRadius: '10px',
          padding: '20px',
          margin: '24px 0',
        }}
      >
        <Text
          style={{
            margin: '0 0 16px',
            fontSize: '13px',
            fontWeight: '700',
            color: brand.text,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Innloggingsdetaljer
        </Text>

        <div style={{ marginBottom: '12px' }}>
          <Text
            style={{
              margin: '0 0 2px',
              fontSize: '11px',
              fontWeight: '600',
              color: brand.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            E-postadresse
          </Text>
          <Text
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: '600',
              color: brand.text,
            }}
          >
            {props.email}
          </Text>
        </div>

        <div>
          <Text
            style={{
              margin: '0 0 2px',
              fontSize: '11px',
              fontWeight: '600',
              color: brand.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Midlertidig passord
          </Text>
          <Text
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: '700',
              color: brand.text,
              fontFamily: 'monospace',
            }}
          >
            {props.password}
          </Text>
        </div>
      </div>

      <ActionButton href={props.loginUrl} label="Logg inn nå" />

      <Hr style={{ borderColor: brand.border, margin: '24px 0' }} />

      <Text
        style={{
          fontSize: '12px',
          lineHeight: '1.6',
          color: brand.mutedLight,
          margin: '0',
        }}
      >
        Av sikkerhetsmessige årsaker bør du endre passordet ditt etter første
        innlogging. Har du spørsmål? Ta kontakt på{' '}
        <a
          href="mailto:support@nordmatengros.no"
          style={{ color: brand.gold, textDecoration: 'none' }}
        >
          support@nordmatengros.no
        </a>
        .
      </Text>
    </EmailWrapper>
  );
}
