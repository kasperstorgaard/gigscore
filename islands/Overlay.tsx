import { useEffect, useState } from "preact/hooks";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
};

export default function Overlay({ isOpen, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
  }, [isOpen])

  return (
    <div
      class="overlay"
      data-is-visible={isVisible}
      data-is-open={isOpen}
      onClick={onClose}
      onAnimationEnd={() => setIsVisible(Boolean(isOpen))}
    />
  );
}
