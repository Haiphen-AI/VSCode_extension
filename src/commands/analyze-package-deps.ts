import * as vscode from "vscode";
import axios from "axios";
import { headers } from "../services/config";
import { HaiphenPackageAnalysis } from "../types";
import { fetchVulnerability } from "../services/fetch-vulnerability";

type HaiphenResponse = {
  errors?: ({ message: string } & { [x: string]: any })[];
  data?: { srcQuery: string };
};

const apiURL = "https://api.haiphen.io/";
const { showInformationMessage, showErrorMessage, showQuickPick } =
  vscode.window;

/** Query haiphen-ai's API */
export const analyzePackageDeps = async (software: string) => {
  if (!software) {
    return;
  }

  const data = {
    operationName: "Query",
    variables: { software },
    query: "query Query($software: String!) {\nsrcQuery(software: $software)\n}"
  };

  return axios
    .post(apiURL, data, { headers })
    .then((res) => extractResponse(res.data))
    .then(assessResponse)
    .catch(async (e) => {
      await showErrorMessage(JSON.stringify(e));
      return [];
    });
};

export default analyzePackageDeps;

/** Pull out relevant response data from API */
function extractResponse(d: any): HaiphenPackageAnalysis {
  const { data, errors } = (d as HaiphenResponse) || {};
  return !data || errors?.length
    ? ({} as HaiphenPackageAnalysis)
    : (JSON.parse(data.srcQuery) as HaiphenPackageAnalysis);
}

/** Analyze `vulnerabilities` property of axios response */
async function assessResponse(d: HaiphenPackageAnalysis) {
  if (Object.keys(d).length === 0) {
    return showErrorMessage("Package not found");
  }

  const { start, end, segments } = d;
  const { vulnerabilities: v, software, version } = start.properties;
  const name = `${software} ${version}`;
  if (["", "[]"].includes(v)) {
    const msg = `No vulnerabilities found for ${name}`;
    return showInformationMessage(msg);
  }

  const raw = v.replace("[", "").replace("]", "");
  const vulnerabilities = raw
    .split(",")
    .map((v1) => v1.trim().replace("'", "").replace("'", ""));
  const howMany = vulnerabilities.length;
  showErrorMessage(`${name} has ${howMany} vulnerabilities`);
  const opts = vulnerabilities.map((label) => ({ label }));
  await selectVulnerability(name, opts);
}

/**
 * Select from a list of `vulnerabilities`. Allow user to select
 * multiple until they exit without a selection
 */
async function selectVulnerability(name: string, opts: { label: string }[]) {
  const title = `View a ${name} vulnerability:`;
  const vulnerability = await showQuickPick(opts, { title });
  if (vulnerability) {
    await fetchVulnerability(vulnerability.label);
    selectVulnerability(name, opts);
  }
}
