import { ShareIcon } from "@/icons/share.tsx";
import { TuneIcon } from "@/icons/tune.tsx";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "preact/hooks";
import Overlay from "#/Overlay.tsx";
import Sidebar from "#/Sidebar.tsx";
import { setTheme, Theme, THEMES } from "../shared/db/theme.ts";

type Props = {
  initialTheme: Theme;
};

export default function HeaderActions({ initialTheme }: Props) {
  const share = () => {
    window.navigator.share({
      url: window.location.href,
    });
  };

  const [canShare, setCanshare] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    if (!window.navigator.canShare) return;
    setCanshare(window.navigator.canShare({ url: "" }));
  }, []);

  const saveSettings = async (payload: { theme: Theme }) => {
    const response = await fetch("/api/settings", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) return;

    document.documentElement.querySelectorAll("body > main, body > header")
      .forEach((el) =>
        el.setAttribute(
          "color-scheme",
          payload.theme,
        )
      );
    setTheme(payload.theme);
  };

  return (
    <aside class="header-actions">
      {canShare && (
        <button onClick={share} aria-label="Share">
          <ShareIcon />
        </button>
      )}

      {
        <button
          onClick={() => setIsSettingsOpen((prev) => !prev)}
          aria-label="Settings"
        >
          <TuneIcon />
        </button>
      }

      <Sidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      >
        <form
          onChange={(ev) => {
            ev.preventDefault();

            const formData = new FormData(ev.currentTarget);
            const payload = {
              theme: formData.get("theme")?.toString() as Theme,
            };

            saveSettings(payload);
          }}
        >
          <fieldset>
            {THEMES.map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="theme"
                  value={value}
                  checked={value === theme}
                />
                {value}
              </label>
            ))}
          </fieldset>
        </form>
      </Sidebar>
    </aside>
  );
}
