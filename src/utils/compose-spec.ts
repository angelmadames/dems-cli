const COMPOSE_SPEC_JSON_FILE_RULE =
  'https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json';

const downloadComposeSpecJSON = (
  url: URL = new URL(COMPOSE_SPEC_JSON_FILE_RULE),
) => {
  console.log(url.toString());
};

// Execute script only if called directly
if (import.meta.path === Bun.main) {
  downloadComposeSpecJSON();
}
