// Modified by Tofu for the Tofu app gallery (see TOFU.md at the repository root): `updateJson`
// calls jq-web 0.6's API. Upstream calls `jq.promised.json`, which jq-web 0.6 no longer has.
import toast from "react-hot-toast";
import useFile from "../store/useFile";
import useJson from "../store/useJson";

const useJsonQuery = () => {
  const getJson = useJson(state => state.getJson);
  const setContents = useFile(state => state.setContents);

  const transformer = async ({ value }) => {
    const { run } = await import("json_typegen_wasm");
    return run("Root", value, JSON.stringify({ output_mode: "typescript/typealias" }));
  };

  const updateJson = async (query: string, cb?: () => void) => {
    try {
      // jq-web 0.6 exports a promise of `{ json, raw }`; the bundler may hand back either.
      const mod = await import("jq-web");
      const jq = "json" in mod ? mod : await mod.default;
      const res = jq.json(JSON.parse(getJson()), query);

      setContents({ contents: JSON.stringify(res, null, 2) });
      cb?.();
    } catch (error) {
      console.error(error);
      toast.error("Unable to process the request.");
    }
  };

  const getJsonType = async () => {
    const types = await transformer({ value: getJson() });
    return types;
  };

  return { updateJson, getJsonType };
};

export default useJsonQuery;
