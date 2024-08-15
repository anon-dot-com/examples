import { useEffect, useState } from "react";
import { AnonRuntime, AnonClient } from "@anon/sdk-browser-extension";
import type { AnonLinkConfig } from "@anon/link-types";
import type { Environment } from "@anon/sdk-typescript";

const API_KEY = process.env.PLASMO_PUBLIC_ANON_API_KEY;
const LINK_CONFIG: Omit<AnonLinkConfig, "app"> = {
  environment: process.env.PLASMO_PUBLIC_ANON_ENVIRONMENT as Environment,
  clientId: process.env.PLASMO_PUBLIC_ANON_CLIENT_ID,
  appUserIdToken: process.env.PLASMO_PUBLIC_ANON_USER_ID_TOKEN,
  company: "Anonymity Labs",
  companyLogo: "https://avatars.githubusercontent.com/u/132958123?s=200&v=4",
  // this is the ID of the extension itself
  chromeExtensionId: chrome.runtime.id,
};
console.log(chrome.runtime.id)
const ANON_CLIENT = new AnonClient({
  environment: LINK_CONFIG.environment,
  clientId: LINK_CONFIG.clientId,
  authToken: API_KEY,
  debug: true,
});

const tableStyle = {
  width: "100%",
};

const theadTrStyle = {
  backgroundColor: "#D7DEEA",
  color: "black",
  fontWeight: "bold",
};

const thTdStyle = {
  padding: "5px 10px",
  textAlign: "left" as "left",
};

const tbodyTrStyle = {
  borderBottom: "1px solid #dddddd",
};

const tbodyTdStyle = {
  margin: "auto",
  padding: "5px 15px",
  whiteSpace: "nowrap",
};

const tbodyTrHoverStyle = {
  backgroundColor: "#f1f1f1",
};

interface AppIntegrationListItem {
  id: string;
  displayName: string;
  iconUrl: string;
}

interface SessionListItem {
  sessionId: string;
  app: string;
  appUser: {
    email: string;
    id: string;
    anonId: string;
  };
}

const AppIntegrationsListComponent = ({
  appIntegrationListItems,
  onLink,
  onReset,
}: {
  appIntegrationListItems: AppIntegrationListItem[];
  onLink: (appIntegrationListItem: AppIntegrationListItem) => void;
  onReset: (appIntegrationListItem: AppIntegrationListItem) => void;
}) => {
  const [hover, setHover] = useState(-1);
  const onMouseEnter = (index: number) => () => setHover(index);
  const onMouseLeave = (index: number) => () => setHover(-1);

  return (
    <table style={tableStyle}>
      <thead style={theadTrStyle}>
        <tr>
          <th style={thTdStyle}>App</th>
          <th style={thTdStyle} />
          <th style={thTdStyle} />
        </tr>
      </thead>
      <tbody>
        {appIntegrationListItems.map((item, index) => {
          const rowStyle = {
            ...tbodyTrStyle,
            ...(hover === index ? tbodyTrHoverStyle : {}),
          };
          return (
            <tr
              key={index}
              style={rowStyle}
              onMouseEnter={onMouseEnter(index)}
              onMouseLeave={onMouseLeave(index)}
            >
              <td style={tbodyTdStyle}>{item.displayName}</td>
              <td>
                <button onClick={() => onLink(item)}>Link</button>
              </td>
              <td>
                <button onClick={() => onReset(item)}>Reset</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const SessionListComponent = ({
  sessionListItems,
  onRun,
  onDelete,
}: {
  sessionListItems: SessionListItem[];
  onRun: (sessionListItem: SessionListItem) => void;
  onDelete: (sessionListItem: SessionListItem) => void;
}) => {
  const [hover, setHover] = useState(-1);
  const onMouseEnter = (index: number) => () => setHover(index);
  const onMouseLeave = (index: number) => () => setHover(-1);

  return (
    <table style={tableStyle}>
      <thead style={theadTrStyle}>
        <tr>
          <th style={thTdStyle}>App</th>
          <th style={thTdStyle}>User ID</th>
          <th style={thTdStyle} />
          <th style={thTdStyle} />
        </tr>
      </thead>
      <tbody>
        {sessionListItems.map((item, index) => {
          const rowStyle = {
            ...tbodyTrStyle,
            ...(hover === index ? tbodyTrHoverStyle : {}),
          };
          return (
            <tr
              key={index}
              style={rowStyle}
              onMouseEnter={onMouseEnter(index)}
              onMouseLeave={onMouseLeave(index)}
            >
              <td style={tbodyTdStyle}>{item.app}</td>
              <td style={tbodyTdStyle}>{item.appUser.id}</td>
              <td>
                <button onClick={() => onRun(item)}>Run</button>
              </td>
              <td>
                <button onClick={() => onDelete(item)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// Parse a JWT to extract claims.
// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
// We keep this implementation light because this runs on the client side,
// so we don't have access to any parsing done once a jwt is passed to our system.
const parseJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
};

function IndexPopup() {
  const [sessionListItems, setSessionListItems] = useState([]);
  const [appIntegrationListItems, setAppIntegrationListItems] = useState([]);
  const [proxyEnabled, setProxyEnabled] = useState(true);
  const [updatedSessions, setUpdatedSessions] = useState(null);

  useEffect(() => {
    console.log("Loading sessions");
    ANON_CLIENT.getSessions().then(async ({ sessions }) => {
      console.log(sessions);
      setSessionListItems(sessions);
    });
    console.log("Loading app integrations");
    ANON_CLIENT.getAppIntegrations().then(async ({ apps }) => {
      console.log(apps);
      setAppIntegrationListItems(apps);
    });
  }, [updatedSessions]);

  const { sub: userId } = parseJwt(LINK_CONFIG.appUserIdToken);

  const refresh = () => {
    console.log("Refresh!");
    setUpdatedSessions(Date.now().toString());
  };

  const clearProxy = () => {
    console.log("Clear proxy!");
    AnonRuntime.reset().then((res) => console.log("cleared proxy", res));
  };

  const runSession = async (sessionListItem: SessionListItem) => {
    console.log("Run session!", sessionListItem);
    await AnonRuntime.run(sessionListItem.sessionId, {
      proxyEnabled,
      createTab: true,
    });
  };

  const linkSession = async (
    appIntegrationListItem: AppIntegrationListItem,
  ) => {
    console.log("Link session!", appIntegrationListItem);
    const protocol = LINK_CONFIG.environment === "local" ? "http" : "https";
    const basePath = `${protocol}://link.svc.${LINK_CONFIG.environment}.anon.com`;
    const linkConfig = {
      ...LINK_CONFIG,
      app: appIntegrationListItem.id,
    };
    const url = `${basePath}?${new URLSearchParams(linkConfig).toString()}`;
    await chrome.tabs.create({ url });
  };

  const resetSession = async (
    appIntegrationListItem: AppIntegrationListItem,
  ) => {
    console.log("Reset session!", appIntegrationListItem);
    await AnonRuntime.reset(appIntegrationListItem.id);
  };

  const deleteSession = async (sessionListItem: SessionListItem) => {
    console.log("Delete session!", sessionListItem);
    await AnonRuntime.delete(sessionListItem.sessionId);
    refresh();
  };

  return (
    <div
      style={{
        padding: 16,
        minWidth: 400
      }}
    >
      <div>User ID: {userId}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px 0px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: 20,
          }}
        >
          {proxyEnabled ? (
            <div style={{ color: "green" }}>Proxy Enabled</div>
          ) : (
            <div style={{ color: "red" }}>Proxy Disabled</div>
          )}
          <button
            style={{ margin: "10px 10px", height: "100%" }}
            onClick={() => setProxyEnabled(!proxyEnabled)}
          >
            {proxyEnabled ? "Disable" : "Enable"}
          </button>
        </div>
        <button
          style={{
            margin: "10px 10px",
            height: 20,
          }}
          onClick={clearProxy}
        >
          Clear Proxy
        </button>
        <button
          style={{
            margin: "10px 10px",
            height: 20,
          }}
          onClick={refresh}
        >
          Refresh
        </button>
      </div>
      <AppIntegrationsListComponent
        appIntegrationListItems={appIntegrationListItems}
        onLink={linkSession}
        onReset={resetSession}
      />
      <SessionListComponent
        sessionListItems={sessionListItems}
        onRun={runSession}
        onDelete={deleteSession}
      />
    </div>
  );
}

export default IndexPopup;
