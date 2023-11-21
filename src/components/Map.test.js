import { render, screen, fireEvent } from "@testing-library/react";
import Map from "./__mocks__/Map";
import React from "react";
import { jenks } from "simple-statistics";

/* Only legend and map hover logic is tested as all the rest relies on Mapbox internal logic**/

jest.mock("./Map");

const mockInputData = {
  dataSources: {
    mosquito: {
      data: {
        features: [
          { properties: { SUAMN: 40 } },
          { properties: { SUAMN: 42 } },
          { properties: { SUAMN: 48 } },
          { properties: { SUAMN: 76 } },
          { properties: { SUAMN: 90 } },
          { properties: { SUAMN: 91 } },
          { properties: { SUAMN: 92 } },
          { properties: { SUAMN: 92.1 } },
          { properties: { SUAMN: 99.8 } },
        ],
      },
    },
  },
};

//Should be changed according to data
const discretizationNbOfGroups = 3;

describe("Legend", () => {
  beforeAll(() => {
    render(<Map props={mockInputData} />);
  });

  test("legend is drawn with the correct values", () => {
    const legend = screen.getByTestId("legend");
    const legendItems = legend.childNodes[1].childNodes;
    const discretizationStops = jenks(
      mockInputData.dataSources.mosquito.data.features.map(
        (f) => f.properties.SUAMN
      ),
      discretizationNbOfGroups
    );

    expect(legendItems[0].childNodes[1].innerHTML).toBe(
      `${discretizationStops[0]} - ${discretizationStops[1]}`
    );
    expect(legendItems[1].childNodes[1].innerHTML).toBe(
      `${discretizationStops[1]} - ${discretizationStops[2]}`
    );
    expect(legendItems[2].childNodes[1].innerHTML).toBe(
      `${discretizationStops[2]} - ${discretizationStops[3]}`
    );
  });
});
describe("Map", () => {
  describe("On mouse move event", () => {
    beforeEach(() => render(<Map props={mockInputData} />));
    describe("when no feature is hovered", () => {
      test("user is still invited to hover the map", () => {
        const mapEl = screen.getAllByTestId("map")[0];

        fireEvent.mouseMove(mapEl, {
          target: {
            // features: [],
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
              features: [{ properties: { name: "Oslo", SUAMN: 45 } }],
            },
          });
          const infoBoxEl = screen.getAllByTestId("infobox")[0];
          expect(infoBoxEl.childNodes[0].innerHTML.trim()).toBe("Oslo 45%");
        });
      });
    });
    describe("when a different feature was hovered before", () => {
      test("new name and data are displayed in the info box", () => {
        //Update the component's state value
        const stubInitialState = [{ properties: { name: "Oslo", SUAMN: 45 } }];
        jest
          .spyOn(React, "useState")
          .mockImplementationOnce(() => React.useState(stubInitialState));

        const mapEl = screen.getAllByTestId("map")[0];
        fireEvent.mouseMove(mapEl, {
          target: {
            features: [{ properties: { name: "Göteborg", SUAMN: 85 } }],
          },
        });
        const infoBoxEl = screen.getAllByTestId("infobox")[0];
        expect(infoBoxEl.childNodes[0].innerHTML.trim()).toBe("Göteborg 85%");
      });
    });
  });

  describe("On mouse leave event", () => {
    beforeEach(() => render(<Map props={mockInputData} />));
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
