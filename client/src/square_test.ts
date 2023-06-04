import * as assert from 'assert';
import { solid, split, toJson, fromJson, Square, Path, getSubtreeRoot, replaceSubtree } from './square';
import { cons, nil } from './list';


describe('square', function() {

  it('toJson', function() {
    assert.deepEqual(toJson(solid("white")), "white");
    assert.deepEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("red"));
    assert.deepEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "red"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepEqual(fromJson("white"), solid("white"));
    assert.deepEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "red"]),
        split(s1, solid("green"), s1, solid("red")));

    assert.deepEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });

  it('getSubtreeRoot', function () {
    const sq1: Square = solid("blue");
    const sq2: Square = solid("orange");
    const sq3: Square = solid("purple");
    const sq4: Square = solid("red");
    const sq5: Square = split(sq1, sq2, sq3, sq4);
    const sq6: Square = split(sq5, sq2, sq3, sq4);
    const sq7: Square = split(sq1, sq5, sq3, sq4);
    const sq8: Square = split(sq1, sq2, sq5, sq4);
    const sq9: Square = split(sq1, sq2, sq3, sq5);

    const L1:  Path = "nil";
    const L2:  Path = cons("NW", nil);
    const L3:  Path = cons("NW", cons("NE", nil));
    const L4:  Path = cons("NE", nil);
    const L5:  Path = cons("NW", cons("NW", nil));
    const L6:  Path = cons("NE", cons("NW", nil));
    const L7:  Path = cons("NE", cons("SW", nil));
    const L8:  Path = cons("SW", nil);
    const L9:  Path = cons("SW", cons("SE", nil));
    const L10: Path = cons("SW", cons("SW", nil));
    const L11: Path = cons("SE", nil);
    const L12: Path = cons("SE", cons("NW", nil));
    const L13: Path = cons("SE", cons("SE", nil));

    assert.deepEqual(getSubtreeRoot(sq1, L1), sq1);     // base case: path is nil #1
    assert.deepEqual(getSubtreeRoot(sq5, L1), sq5);     // base case: path is nil #2
    assert.deepEqual(getSubtreeRoot(sq1, L2), sq1);     // base case: sq is solid #1
    assert.deepEqual(getSubtreeRoot(sq1, L3), sq1);     // base case: sq is solid #2

    assert.deepEqual(getSubtreeRoot(sq5, L2), sq1);     // NW 1 case
    assert.deepEqual(getSubtreeRoot(sq5, L3), sq1);
    assert.deepEqual(getSubtreeRoot(sq6, L3), sq2);     // NW many case
    assert.deepEqual(getSubtreeRoot(sq6, L5), sq1);

    assert.deepEqual(getSubtreeRoot(sq5, L4), sq2);     // NE 1 case
    assert.deepEqual(getSubtreeRoot(sq5, L6), sq2);
    assert.deepEqual(getSubtreeRoot(sq7, L6), sq1);     // NE many case
    assert.deepEqual(getSubtreeRoot(sq7, L7), sq3);

    assert.deepEqual(getSubtreeRoot(sq5, L8), sq3);     // SW 1 case
    assert.deepEqual(getSubtreeRoot(sq5, L9), sq3);
    assert.deepEqual(getSubtreeRoot(sq8, L9), sq4);     // SW many case
    assert.deepEqual(getSubtreeRoot(sq8, L10), sq3);

    assert.deepEqual(getSubtreeRoot(sq5, L11), sq4);    // SE 1 case
    assert.deepEqual(getSubtreeRoot(sq5, L12), sq4);
    assert.deepEqual(getSubtreeRoot(sq9, L12), sq1);    // SE many case
    assert.deepEqual(getSubtreeRoot(sq9, L13), sq4);
  });

  it('replaceSubtree', function () {
    const L1:  Path = cons("NE", cons("NW", nil));
    const L2:  Path = "nil";
    const L3:  Path = cons("NE", nil);
    const L4:  Path = cons("NE", cons("NE", nil));
    const L5:  Path = cons("NW", nil);
    const L6:  Path = cons("NW", cons("NW", nil));
    const L7:  Path = cons("NW", cons("SW", nil));
    const L8:  Path = cons("SW", nil);
    const L9:  Path = cons("SW", cons("SW", nil));
    const L10: Path = cons("SW", cons("NW", nil));
    const L11: Path = cons("SE", nil);
    const L12: Path = cons("SE", cons("SE", nil));
    const L13: Path = cons("SE", cons("NW", nil));
  
    const sq1:  Square = split(solid("purple"), split(solid("green"), solid("yellow"), solid("white"), solid("blue")), solid("red"), solid("orange"));
    const sq2:  Square = solid("blue");
    const sq3:  Square = split(solid("purple"), split(solid("blue"), solid("yellow"), solid("white"), solid("blue")), solid("red"), solid("orange"));
    const sq4:  Square = solid("blue");
    const sq5:  Square = solid("orange");
    const sq6:  Square = solid("purple");
    const sq7:  Square = solid("red");
    const sq8:  Square = split(sq4, sq5, sq6, sq7);
    const sq9:  Square = split(sq4, sq2, sq6, sq7);
    const sq10: Square = split(sq4, sq8, sq6, sq7);
    const sq11: Square = split(sq4, split(sq2, sq5, sq6, sq7), sq6, sq7);
    const sq12: Square = split(sq4, split(sq4, sq2, sq6, sq7), sq6, sq7);
    const sq13: Square = split(sq2, sq5, sq6, sq7);
    const sq14: Square = split(sq8, sq5, sq6, sq7);
    const sq15: Square = split(split(sq2, sq5, sq6, sq7), sq5, sq6, sq7);
    const sq16: Square = split(split(sq4, sq5, sq2, sq7), sq5, sq6, sq7);
    const sq17: Square = split(sq4, sq5, sq2, sq7);
    const sq18: Square = split(sq4, sq5, sq8, sq7);
    const sq19: Square = split(sq4, sq5, split(sq4, sq5, sq2, sq7), sq7);
    const sq20: Square = split(sq4, sq5, split(sq2, sq5, sq6, sq7), sq7);
    const sq21: Square = split(sq4, sq5, sq6, sq2);
    const sq22: Square = split(sq4, sq5, sq6, sq8);
    const sq23: Square = split(sq4, sq5, sq6, split(sq4, sq5, sq6, sq2));
    const sq24: Square = split(sq4, sq5, sq6, split(sq2, sq5, sq6, sq7));

    assert.deepEqual(replaceSubtree(sq1, L1, sq2), sq3);        // complicated example in Ed

    assert.deepEqual(replaceSubtree(sq4, L1, sq2), sq2);        // base case: path is nil #1
    assert.deepEqual(replaceSubtree(sq5, L1, sq2), sq2);        // base case: path is nil #2
    assert.deepEqual(replaceSubtree(sq1, L2, sq2), sq2);        // base case: sq is solid #1
    assert.deepEqual(replaceSubtree(sq5, L2, sq2), sq2);        // base case: sq is solid #2

    assert.deepEqual(replaceSubtree(sq8, L5, sq2), sq13);       // NW 1 case
    assert.deepEqual(replaceSubtree(sq8, L6, sq2), sq13);
    assert.deepEqual(replaceSubtree(sq14, L6, sq2), sq15);      // NW many case
    assert.deepEqual(replaceSubtree(sq14, L7, sq2), sq16);

    assert.deepEqual(replaceSubtree(sq8, L3, sq2), sq9);        // NE 1 case
    assert.deepEqual(replaceSubtree(sq8, L1, sq2), sq9);
    assert.deepEqual(replaceSubtree(sq10, L1, sq2), sq11);      // NE many case
    assert.deepEqual(replaceSubtree(sq10, L4, sq2), sq12);

    assert.deepEqual(replaceSubtree(sq8, L8, sq2), sq17);       // SW 1 case
    assert.deepEqual(replaceSubtree(sq8, L9, sq2), sq17);
    assert.deepEqual(replaceSubtree(sq18, L9, sq2), sq19);      // SW many case
    assert.deepEqual(replaceSubtree(sq18, L10, sq2), sq20);

    assert.deepEqual(replaceSubtree(sq8, L11, sq2), sq21);      // SE 1 case
    assert.deepEqual(replaceSubtree(sq8, L12, sq2), sq21);
    assert.deepEqual(replaceSubtree(sq22, L12, sq2), sq23);     // SE many case
    assert.deepEqual(replaceSubtree(sq22, L13, sq2), sq24);
  });
});
