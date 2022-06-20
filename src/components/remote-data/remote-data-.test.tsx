import React from "react";
import { describe, it } from "vitest";
import { render, screen } from "~/test-utils";
import { RemoteData } from "./remote-data";

function Loading(): JSX.Element {
  return <div>loading...</div>;
}

function Error(): JSX.Element {
  return <div>error</div>;
}

function Data({
  name,
  isFetching = false,
}: {
  name: string;
  isFetching?: boolean;
}): JSX.Element {
  return (
    <div>
      hello {name} {isFetching ? "fetching" : ""}
    </div>
  );
}

describe("<RemoteData />", () => {
  it("renders a loading screen initially", async () => {
    render(
      <RemoteData
        isLoading
        isFetching={false}
        error={undefined}
        data={undefined}
        renderLoading={() => <Loading />}
        renderError={() => <Error />}
        render={(name: string) => <Data name={name} />}
      />
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders an error screen when there is an error", async () => {
    render(
      <RemoteData
        isLoading={false}
        isFetching={false}
        error={{ statusCode: 500 }}
        data={undefined}
        renderLoading={() => <Loading />}
        renderError={() => <Error />}
        render={(name: string) => <Data name={name} />}
      />
    );
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it("renders when there is data with access to the fetching indicator", async () => {
    render(
      <RemoteData
        isLoading={false}
        isFetching={true}
        error={undefined}
        data={"jane doe"}
        renderLoading={() => <Loading />}
        renderError={() => <Error />}
        render={(name: string, options) => (
          <div>
            <Data name={name} {...options} />
          </div>
        )}
      />
    );
    expect(screen.getByText(/jane doe/i)).toBeInTheDocument();
    expect(screen.getByText(/fetching/i)).toBeInTheDocument();
  });
});
