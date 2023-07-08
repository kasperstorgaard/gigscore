import { ComponentChildren } from "preact";
import Overlay from "./Overlay.tsx";
import { useEffect, useState } from "preact/hooks";

type Props = {
  children: ComponentChildren;
  isOpen?: boolean;
  onClose: () => void;
};

export default function Sidebar({ children, isOpen, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
  }, [isOpen])

  return (
    <>
      <Overlay isOpen={isOpen} onClose={onClose} />

      <aside
        class="sidebar"
        data-is-open={isOpen}
        data-is-visible={isVisible}
        onClick={(ev) => ev.stopPropagation()}
        onAnimationEnd={() => setIsVisible(Boolean(isOpen))}
      >
        {children}
      </aside>
    </>
  );
}
