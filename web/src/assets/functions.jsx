import jwtDecode from "jwt-decode";

export const utilityFunctions = {
  decodeToken: (token) => {
    // Decode a Json Web Token
    try {
      return {
        header: jwtDecode(token, { header: true }),
        payload: jwtDecode(token),
      };
    } catch (e) {
      return null;
    }
  },
  splitDateString: (d, n) => {
    return d
      .split(/[\.T]/)
      .slice(0, n)
      .map((tkn, i) => (
        <span key={i}>
          <span>{tkn}</span>
        </span>
      ));
  },
  snakeCaseToTitleCase: (inputString) => {
    return inputString
      .split("_")
      .map((c, i) => capitalize(c))
      .join(" ");
  },
};

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1, str.length);
}

export function csvString(dataArray, keys) {
  return [
    keys.map((k) => utilityFunctions.snakeCaseToTitleCase(k)).join(","),
    ...dataArray.reduce((acc, curr) => {
      acc.push(keys.map((key) => curr[key]).join(","));
      return acc;
    }, []),
  ].join("\n");
}

export function array2d(dataArray, keys) {
  return [
    keys.map((k) => utilityFunctions.snakeCaseToTitleCase(k)),
    ...dataArray.reduce((acc, curr) => {
      acc.push(keys.map((key) => curr[key]));
      return acc;
    }, []),
  ];
}

export function joinArrays(string, delimiter, highLightClassName) {
  const result = [];

  const spanner = (str, idx) => <span key={idx}>{str}</span>;

  const highlight = (str, idx) => (
    <b key={idx} className={`${highLightClassName}`}>
      {str}
    </b>
  );

  if (!delimiter || !string) {
    return [string];
  }

  let match = string.match(new RegExp(delimiter, "i"));

  if (match) {
    if (!string.match(new RegExp(delimiter, "i"))[0]) {
      return [string];
    }
  } else {
    return [string];
  }

  let prev = 0;
  let index = 0;

  if (string.slice(prev, match.index)) {
    index += 1;
    result.push(spanner(string.slice(prev, match.index), index));
  }

  do {
    if (match) {
      index += 1;
      result.push(highlight(match[0], index));
    }

    prev += match.index + match[0].length;

    match = string.slice(prev).match(new RegExp(delimiter, "i"));

    if (match) {
      index += 1;
      result.push(spanner(string.slice(prev, prev + match.index), index));
    }
  } while (match);

  if (string.slice(prev)) {
    index += 1;
    result.push(spanner(string.slice(prev), index));
  }

  return result;
}
