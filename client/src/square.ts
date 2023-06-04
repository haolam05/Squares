import { List } from './list';


export type Color = "white" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

export type Square =
    | {readonly kind: "solid", readonly color: Color}
    | {readonly kind: "split", readonly nw: Square, readonly ne: Square,
       readonly sw: Square, readonly se: Square};

export function solid(color: Color): Square {
  return {kind: "solid", color: color};
}

export function split(nw: Square, ne: Square, sw: Square, se: Square): Square {
  return {kind: "split", nw: nw, ne: ne, sw: sw, se: se};
}


/** Returns JSON describing the given Square. */
export function toJson(sq: Square): any {
  if (sq.kind === "solid") {
    return sq.color;
  } else {
    return [toJson(sq.nw), toJson(sq.ne), toJson(sq.sw), toJson(sq.se)];
  }
}

/** Converts a JSON description to the Square it describes. */
export function fromJson(data: any): Square {
  if (typeof data === 'string') {
    switch (data) {
      case "white": case "red": case "orange": case "yellow":
      case "green": case "blue": case "purple":
        return solid(data);

      default:
        throw new Error(`unknown color "${data}"`);
    }
  } else if (Array.isArray(data)) {
    if (data.length === 4) {
      return split(fromJson(data[0]), fromJson(data[1]),
                   fromJson(data[2]), fromJson(data[3]));
    } else {
      throw new Error('split must have 4 parts');
    }
  } else {
    throw new Error(`type ${typeof data} is not a valid square`);
  }
}


/** Indicates one of the four parts of a split. */
export type Dir = "NW" | "NE" | "SE" | "SW";

/** Describes how to get to a square from the root of the tree. */
export type Path = List<Dir>;

/**
 * Given a square and a path, retrieve the root of the subtree at that location (assuming it exists)
 * @param sq root of square to go from
 * @param L path to root of subtree from sq
 * @returns instance of Square, where the square is the root of the subtree
 */
export function getSubtreeRoot(sq: Square, L: Path): Square {
  if (L === "nil" || sq.kind === "solid") {
    return sq;
  } else if (L.hd === "NW") {
    return getSubtreeRoot(sq.nw, L.tl)
  } else if (L.hd === "NE") {
    return getSubtreeRoot(sq.ne, L.tl)
  } else if (L.hd === "SW") {
    return getSubtreeRoot(sq.sw, L.tl)
  } else {  // SE
    return getSubtreeRoot(sq.se, L.tl)
  }
}

/**
 * Given a square, a path, and a second square, return a new square that is the same as the first one except
 * that the subtree whose root is at the given path is replaced by the second square
 * @param sq1 root of square to go from
 * @param L path to root of subtree from sq1
 * @param sq2 the square that will replace the root of subtree
 * @returns instance of Square where, new square = sq1, but "the root of subtree from L" is replaced with "sq2"
 */
export function replaceSubtree(sq1: Square, L: Path, sq2: Square): Square {
  if (L === "nil" || sq1.kind === "solid") {
    return sq2;
  } else if (L.hd === "NW") {
    return split(replaceSubtree(sq1.nw, L.tl, sq2), sq1.ne, sq1.sw, sq1.se);
  } else if (L.hd === "NE") {
    return split(sq1.nw, replaceSubtree(sq1.ne, L.tl, sq2), sq1.sw, sq1.se);
  } else if (L.hd === "SW") {
    return split(sq1.nw, sq1.ne, replaceSubtree(sq1.sw, L.tl, sq2), sq1.se);
  } else {  // SE
    return split(sq1.nw, sq1.ne, sq1.sw, replaceSubtree(sq1.se, L.tl, sq2));
  }
}
