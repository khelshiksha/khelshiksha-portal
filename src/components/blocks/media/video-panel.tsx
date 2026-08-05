"use client";

import { useState } from "react";
import { Film, Play } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { SITE } from "@/lib/constants";

/**
 * The video slot - built to be empty today and correct tomorrow.
 *
 * The channel has no films on it yet, so this renders a card that says so and
 * links to the channel. It deliberately does NOT render an empty player: an
 * embed pointing at nothing is a black rectangle with an error in it, which
 * looks like a broken site rather than a channel that is just new.
 *
 * When a video exists, pass its id and the same component becomes a
 * CLICK-TO-LOAD FACADE. That distinction matters: a plain YouTube <iframe>
 * pulls roughly half a megabyte of Google JavaScript and sets cookies on every
 * single page view, whether or not anyone presses play. Here nothing is
 * requested from YouTube until the visitor asks for it, so the page costs
 * nothing to the majority who never watch - and no third party gets to
 * fingerprint a school principal who merely scrolled past.
 *
 * The poster comes from YouTube's static image host at that point, and the
 * iframe is only mounted after the click, with autoplay so the press that
 * loaded it also starts it.
 */
export function VideoPanel({
  videoId,
  heading,
  intro,
}: {
  videoId?: string;
  heading: string;
  intro?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-h2 text-ink">{heading}</h2>
          {intro !== undefined && (
            <p className="measure text-body-lg text-ink-muted">{intro}</p>
          )}
        </div>

        <div className="border-rule bg-sunken relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] border">
          {videoId === undefined ? (
            /* No film yet. Say so plainly and offer the channel. */
            <a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink group flex size-full flex-col items-center justify-center gap-3 p-6 text-center"
            >
              <Film aria-hidden="true" className="text-energy-text size-10" />
              <span className="text-h4">
                Films from the classroom are coming
              </span>
              <span className="text-body-sm text-ink-muted max-w-[48ch]">
                We are filming sessions in schools now. Subscribe on YouTube and
                you will see them first.
              </span>
              <span className="text-body-sm text-brand-deep font-semibold underline underline-offset-4 group-hover:no-underline">
                Visit our YouTube channel
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          ) : playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={heading}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group relative size-full cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- a
                  third-party host we do not want next/image to proxy. */}
              <img
                src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="bg-brand text-on-brand flex size-16 items-center justify-center rounded-full shadow-lg transition group-hover:scale-110">
                  <Play
                    aria-hidden="true"
                    className="size-7 translate-x-0.5"
                    fill="currentColor"
                  />
                </span>
              </span>
              <span className="sr-only">Play video: {heading}</span>
            </button>
          )}
        </div>
      </Container>
    </Section>
  );
}
