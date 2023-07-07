import { ShareIcon } from "@/icons/share.tsx";
import { TuneIcon } from "@/icons/tune.tsx";
import { useEffect, useState } from "preact/hooks";

export default function HeaderActions() {
  const share = () => {
    window.navigator.share({
      url: window.location.href,
    });
  };

  const [canShare, setCanshare] = useState(false);

  useEffect(() => {
    if (!window.navigator.canShare) return;
    setCanshare(window.navigator.canShare({ url: "" }));
  }, []);

  return (
    <aside class="header-actions">
      {/* {canShare && ( */}
      <button onClick={share}>
        <ShareIcon />
      </button>
      {/* )} */}

      {
        /* <button>
        <TuneIcon />
      </button> */
      }
    </aside>
  );
}
