import React from "react";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { Input } from "../components/Input";
import { Main } from "../components/Main";
import { Select } from "../components/Select";
import { useConfig } from "../contexts/config.ctx";
import { useLock } from "../contexts/data.ctx";
import { useProfile } from "../contexts/profile.ctx";

// biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
const ref = __MTR_EXPLORER_VERSION__;

export function ConfigPage() {
  useLock();
  const [config, setConfig] = useConfig();
  const profileNames = Object.keys(config.profiles);
  const theme = config.theme;

  const profile = useProfile();
  const { systemMap } = profile.current ?? {};

  const setTheme = theme => setConfig(cfg => ({ ...cfg, theme }));
  const setSystemMapDataUrl = val =>
    profile.update(pr => {
      pr.systemMap ??= {};
      pr.systemMap.dataUrl = val;
      return pr;
    });

  return (
    <>
      <Header name="Config">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-baseline">
            <span className="w-[240px]">Theme</span>
            <div className="flex grow">
              <Button
                active={theme === "dark"}
                icon="mdi:moon-and-stars"
                onClick={() => setTheme("dark")}
                text="Dark"
              />
              <Button
                active={theme === undefined}
                icon="mdi:auto-awesome"
                onClick={() => setTheme(undefined)}
                text="System"
              />
              <Button
                active={theme === "light"}
                icon="mdi:white-balance-sunny"
                onClick={() => setTheme("light")}
                text="Light"
              />
            </div>
          </div>
          <label className="flex flex-col items-stretch gap-4 md:flex-row md:items-baseline" htmlFor="cfgProfile">
            <span className="w-[240px]">Profile</span>
            <div className="flex grow">
              <Select
                className="grow"
                id="cfgProfile"
                onChange={ev => profile.change(ev.target.value)}
                value={profile.name}
              >
                {profileNames.map(profile => (
                  <option key={profile} value={profile}>
                    {profile}
                  </option>
                ))}
              </Select>
              <Button icon="mdi:pencil" onClick={() => profile.rename(config.currenProfile)} />
              <Button icon="mdi:close" onClick={() => profile.remove(config.currenProfile)} />
            </div>
            <div>
              <Button icon="mdi:add" onClick={profile.create} />
            </div>
          </label>
        </div>
      </Header>
      <Main>
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl">System map</h2>
          <label className="flex flex-col items-stretch gap-4 md:flex-row md:items-baseline" htmlFor="cfgSMDurl">
            <span className="min-w-[240px]">Data URL</span>
            <div className="flex grow flex-col items-stretch gap-4">
              <Input
                className="grow"
                id="cfgSMDurl"
                onChange={ev => setSystemMapDataUrl(ev.target.value)}
                value={systemMap?.dataUrl ?? ""}
              />
              {`${systemMap?.dataUrl}`.trim().startsWith("http://") && (
                <>
                  <p className="text-yellow-500">
                    <Icon icon="mdi:alert" />
                    Warning: Insecure URL
                  </p>
                  <p>
                    MTR Explorer can only load data from a https server
                    <br />
                    For that it will try to use a public proxy to fetch the data.
                    <br />
                    It will mostly not work if this is not a public URL.
                  </p>
                  <p>
                    Server owners: To prevent usage of public proxy, you need to expose the system-map server in HTTPS
                    using tools like Nginx, Apache or Cors-Anywhere.
                  </p>
                </>
              )}
            </div>
          </label>
        </section>
        {/*
        <section className="flex flex-col mt-4 gap-4">
          <h2 className="text-2xl">Incidents</h2>
          <label className="flex items-center gap-4 flex-wrap">
            <span className="w-[240px]">Shared Incidents URL</span>
            <div className="grow flex">
              <Input className="grow" value={profile.incidents?.sharedUrl} />
            </div>
          </label>
          <label className="flex items-center gap-4 flex-wrap">
            <span className="w-[240px]">Report URL</span>
            <div className="grow flex">
              <Input className="grow" value={profile.incidents?.reportUrl} />
            </div>
          </label>
        </section>
        */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl">Informations</h2>
          <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-baseline">
            <span className="min-w-[240px]">Commit hash Version</span>
            <div className="flex grow flex-col items-stretch gap-4">
              <a href={`https://github.com/YPetremann/MTR-Explorer/commit/${ref}`} rel="noreferrer" target="_blank">
                #{ref}
              </a>
            </div>
          </div>
        </section>
      </Main>
    </>
  );
}
