import { render, screen, fireEvent } from "@testing-library/react";
import Map from "./__mocks__/Map";
import React from "react";

jest.mock("./Map");

describe("Legend", () => {
  beforeAll(() => {
    render(<Map props={{ dataSources: { mosquito: "fake-geojson" } }} />);
  });

  test("legend is drawn with the correct values", () => {
    const legend = screen.getByTestId("legend");
    const legendItems = legend.childNodes[1].childNodes;

    expect(legendItems[0].childNodes[1].innerHTML).toBe("46 - 52.4");
    expect(legendItems[1].childNodes[1].innerHTML).toBe("52.4 - 76.1");
    expect(legendItems[2].childNodes[1].innerHTML).toBe("76.1 - 94.8");
  });
});
describe("Map", () => {
  describe("On mouse move event", () => {
    beforeEach(() =>
      render(<Map props={{ dataSources: { mosquito: "fake-geojson" } }} />)
    );
    describe("when no feature is hovered", () => {
      test("user is still invited to hover the map", () => {
        const mapEl = screen.getAllByTestId("map")[0];

        fireEvent.mouseMove(mapEl, {
          target: {
            features: [],
          },
        });
        const infoBoxEl = screen.getAllByTestId("infobox")[0];
        expect(infoBoxEl.childNodes[0].innerHTML).toBe(
          "Hover a district to see individual values"
        );
      });
    });
    describe("when one feature is hovered", () => {
      describe("when no feature was hovered before", () => {
        test("new name and data are displayed in the info box", () => {
          const mapEl = screen.getAllByTestId("map")[0];

          fireEvent.mouseMove(mapEl, {
            target: {
              features: [{ properties: { name: "Oslo", SUAMNLN: 45 } }],
            },
          });
          const infoBoxEl = screen.getAllByTestId("infobox")[0];
          expect(infoBoxEl.childNodes[0].innerHTML.trim()).toBe("Oslo 45%");
        });
      });
    });
    describe("when a different feature was hovered before", () => {
      test("new name and data are displayed in the info box", () => {
        const stubInitialState = [
          { properties: { name: "Oslo", SUAMNLN: 45 } },
        ];

        jest
          .spyOn(React, "useState")
          .mockImplementationOnce(() => React.useState(stubInitialState));

        const mapEl = screen.getAllByTestId("map")[0];
        fireEvent.mouseMove(mapEl, {
          target: {
            features: [{ properties: { name: "Göteborg", SUAMNLN: 85 } }],
          },
        });
        const infoBoxEl = screen.getAllByTestId("infobox")[0];
        expect(infoBoxEl.childNodes[0].innerHTML.trim()).toBe("Göteborg 85%");
      });
    });
  });

  describe("On mouse leave event", () => {
    beforeEach(() =>
      render(<Map props={{ dataSources: { mosquito: "fake-geojson" } }} />)
    );
    test("user is invited to hover the map again", () => {
      const mapEl = screen.getAllByTestId("map")[0];

      fireEvent.mouseLeave(mapEl);
      const infoBoxEl = screen.getAllByTestId("infobox")[0];
      expect(infoBoxEl.childNodes[0].innerHTML).toBe(
        "Hover a district to see individual values"
      );
    });
  });
});
