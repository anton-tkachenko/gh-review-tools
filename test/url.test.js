import test from "node:test";
import assert from "node:assert/strict";

import { getChangesUrlWithPreferences } from "../url.js";

test("adds both review defaults to a Changes URL", () => {
  assert.equal(
    getChangesUrlWithPreferences("https://github.com/acme/widgets/pull/42/changes"),
    "https://github.com/acme/widgets/pull/42/changes?w=1&show-viewed-files=false"
  );
});

test("keeps supporting the older Files route", () => {
  assert.equal(
    getChangesUrlWithPreferences("https://github.com/acme/widgets/pull/42/files"),
    "https://github.com/acme/widgets/pull/42/files?w=1&show-viewed-files=false"
  );
});

test("preserves existing query parameters and hashes", () => {
  assert.equal(
    getChangesUrlWithPreferences("https://github.com/acme/widgets/pull/42/files?diff=split#discussion_r1"),
    "https://github.com/acme/widgets/pull/42/files?diff=split&w=1&show-viewed-files=false#discussion_r1"
  );
});

test("replaces conflicting values and duplicate filter parameters", () => {
  assert.equal(
    getChangesUrlWithPreferences("https://github.com/acme/widgets/pull/42/files?w=0&w=1&show-viewed-files=true"),
    "https://github.com/acme/widgets/pull/42/files?w=1&show-viewed-files=false"
  );
});

test("does not redirect URLs that are already normalized", () => {
  assert.equal(
    getChangesUrlWithPreferences("https://github.com/acme/widgets/pull/42/files?w=1&show-viewed-files=false"),
    null
  );
});

test("does not affect other GitHub pages or other domains", () => {
  assert.equal(getChangesUrlWithPreferences("https://github.com/acme/widgets/pull/42"), null);
  assert.equal(getChangesUrlWithPreferences("https://github.com/acme/widgets/issues/42"), null);
  assert.equal(getChangesUrlWithPreferences("https://example.com/acme/widgets/pull/42/files"), null);
});

test("removes a managed parameter when its preference is disabled", () => {
  assert.equal(
    getChangesUrlWithPreferences(
      "https://github.com/acme/widgets/pull/42/files?w=1&show-viewed-files=false&diff=split",
      { hideWhitespace: true, hideViewedFiles: false }
    ),
    "https://github.com/acme/widgets/pull/42/files?w=1&diff=split"
  );
});

test("can turn off both defaults without changing unrelated parameters", () => {
  assert.equal(
    getChangesUrlWithPreferences(
      "https://github.com/acme/widgets/pull/42/files?w=1&show-viewed-files=false&diff=unified",
      { hideWhitespace: false, hideViewedFiles: false }
    ),
    "https://github.com/acme/widgets/pull/42/files?diff=unified"
  );
});
