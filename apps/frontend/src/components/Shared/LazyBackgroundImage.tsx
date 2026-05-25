"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface LazyBackgroundImageProps extends BoxProps {
  image: string;
  mobileImage?: string;
  href?: string;
  children?: ReactNode | Array<ReactNode>;
  rootMargin?: string;
  threshold?: number;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  height: string | { xs: string; sm: string; md: string; lg: string; xl: string };
  className?: string;
}

const LazyBackgroundImage = ({
  image,
  mobileImage,
  children,
  className,
  height,
  rootMargin = "50px",
  threshold = 0.01,
  ...boxProps
}: LazyBackgroundImageProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Determine which image to use based on screen size
  const currentImage = isMobile && mobileImage ? mobileImage : image;

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    // Check if Intersection Observer is supported
    if (!("IntersectionObserver" in window)) {
      // Fallback: Use scroll event listeners for older browsers
      let timeoutId: NodeJS.Timeout | null = null;

      /**
       * Check if element is in viewport using getBoundingClientRect
       */
      const isElementInViewport = (): boolean => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        // Parse rootMargin to add buffer zone
        const margin = parseInt(rootMargin) || 0;

        // Check if element is visible in viewport with margin
        return rect.top <= windowHeight + margin && rect.bottom >= -margin && rect.left <= windowWidth + margin && rect.right >= -margin;
      };

      /**
       * Throttled scroll handler to improve performance
       */
      const handleScroll = () => {
        if (timeoutId) {
          return;
        }

        timeoutId = setTimeout(() => {
          // Use requestAnimationFrame to ensure DOM measurements happen at the right time
          requestAnimationFrame(() => {
            if (isElementInViewport()) {
              setIsInView(true);
            }
          });
          timeoutId = null;
        }, 100); // Throttle to 100ms
      };

      // Cache window reference for type safety
      const win = window as Window;

      // Initial check on mount
      if (isElementInViewport()) {
        setIsInView(true);
      } else {
        // Add event listeners if not initially in view
        win.addEventListener("scroll", handleScroll, { passive: true } as AddEventListenerOptions);
        win.addEventListener("resize", handleScroll, { passive: true } as AddEventListenerOptions);
        win.addEventListener("orientationchange", handleScroll, { passive: true } as AddEventListenerOptions);
      }

      // Cleanup function
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        win.removeEventListener("scroll", handleScroll);
        win.removeEventListener("resize", handleScroll);
        win.removeEventListener("orientationchange", handleScroll);
      };
    }

    // Intersection Observer implementation (modern browsers)
    const observerOptions = {
      root: null,
      rootMargin,
      threshold,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    observer.observe(element);

    // Cleanup function
    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  useEffect(() => {
    if (!isInView || !currentImage) {
      return;
    }

    // Reset loaded state when image changes
    setIsLoaded(false);

    // Preload the image
    const img = new Image();

    const handleLoad = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      console.error(`Failed to load background image: ${currentImage}`);
      // setIsLoaded(true);
    };

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);
    img.src = currentImage;

    // Cleanup function
    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [isInView, currentImage]);

  return (
    <Box
      component="div"
      ref={elementRef}
      className={className}
      {...boxProps}
      sx={[
        {
          p: 0,
          m: 0,
          position: "relative",
          height,
          overflow: "hidden",
        },
        isLoaded && currentImage
          ? {
              backgroundImage: `url(${currentImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transition: "background-image 0.3s ease-in-out",
            }
          : { background: "transparent" },
        ...(Array.isArray(boxProps.sx) ? boxProps.sx : [boxProps.sx]),
      ]}
    >
      {/* Skeleton Loading State */}
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "grey.300",
            transform: "none",
            zIndex: 0,
          }}
        />
      )}
      {children}
    </Box>
  );
};

export default LazyBackgroundImage;
