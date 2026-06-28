"use client";

import { useEffect } from "react";

export function LandingAnimations() {
  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    const run = async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);
        document.documentElement.dataset.motionReady = "true";

        const isAlreadyVisible = (element: HTMLElement, viewportRatio: number) => {
          const rect = element.getBoundingClientRect();
          return rect.top < window.innerHeight * viewportRatio && rect.bottom > 0;
        };

        const ctx = gsap.context(() => {
          const intro = gsap.timeline({
            defaults: { ease: "power3.out" },
          });

          intro
            .fromTo(
              ".brand",
              { autoAlpha: 0, y: -8, filter: "blur(5px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.48,
                clearProps: "opacity,visibility,filter",
              },
            )
            .fromTo(
              ".nav-actions > *",
              { autoAlpha: 0, y: -7, filter: "blur(5px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.46,
                stagger: 0.04,
                clearProps: "opacity,visibility,filter",
              },
              "<0.08",
            )
            .fromTo(
              ".hero-mark",
              { autoAlpha: 0, y: 12, scale: 0.96, filter: "blur(7px)" },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.68,
                clearProps: "opacity,visibility,filter",
              },
              "<0.04",
            )
            .fromTo(
              ".hero-kicker",
              { autoAlpha: 0, y: 10, filter: "blur(5px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.48,
                clearProps: "opacity,visibility,filter",
              },
              "<0.20",
            )
            .fromTo(
              "h1 .hero-line",
              {
                autoAlpha: 0,
                yPercent: 32,
                filter: "blur(8px)",
                clipPath: "inset(0% 0% 18% 0%)",
              },
              {
                autoAlpha: 1,
                yPercent: 0,
                filter: "blur(0px)",
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.74,
                stagger: 0.08,
                clearProps: "opacity,visibility,filter,clipPath",
              },
              "<0.10",
            )
            .fromTo(
              [".subtitle", ".hero-actions", ".meta"],
              { autoAlpha: 0, y: 14, filter: "blur(6px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.58,
                stagger: 0.06,
                clearProps: "opacity,visibility,filter",
              },
              "<0.34",
            )
            .fromTo(
              ".hero-window",
              {
                autoAlpha: 0,
                y: 30,
                scale: 0.992,
                filter: "blur(8px)",
                clipPath: "inset(4% 2% 0% 2% round 24px)",
              },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                clipPath: "inset(0% 0% 0% 0% round 24px)",
                duration: 0.88,
                clearProps: "opacity,visibility,filter,clipPath",
              },
              "<0.12",
            )
            .fromTo(
              ".hero-window img",
              { scale: 1.012, y: 8 },
              {
                scale: 1,
                y: 0,
                duration: 0.9,
              },
              "<",
            );

          gsap.to(".hero-window img", {
            y: -8,
            scale: 1.004,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1.4,
            },
          });

        });
        try {
          ctx.add(() => {
            gsap.to(".product-window-main", {
              y: -8,
              x: -2,
              scale: 1.002,
              ease: "none",
              scrollTrigger: {
                trigger: ".product-stage",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4,
              },
            });
            gsap.to(".product-window-float", {
              y: -14,
              x: 4,
              rotate: -0.15,
              scale: 1.003,
              ease: "none",
              scrollTrigger: {
                trigger: ".product-stage",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4,
              },
            });

            gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
              if (isAlreadyVisible(section, 0.96)) return;

              gsap.from(section, {
                autoAlpha: 0,
                y: 14,
                duration: 0.56,
                ease: "power3.out",
                clearProps: "opacity,visibility",
                scrollTrigger: {
                  trigger: section,
                  start: "top 96%",
                  once: true,
                },
              });
            });

            gsap.utils.toArray<HTMLElement>(".reveal-card").forEach((card) => {
              if (isAlreadyVisible(card, 0.94)) return;

              gsap.from(card, {
                autoAlpha: 0,
                y: 10,
                duration: 0.46,
                ease: "power3.out",
                clearProps: "opacity,visibility",
                scrollTrigger: {
                  trigger: card,
                  start: "top 94%",
                  once: true,
                },
              });
            });
          });
        } catch (error) {
          ctx.revert();
          throw error;
        }

        cleanup = () => {
          ctx.revert();
        };
      } catch (error) {
        document.documentElement.dataset.motionReady = "true";

        if (process.env.NODE_ENV !== "production") {
          console.warn("Landing animations failed to load", error);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
