/* eslint-disable @typescript-eslint/naming-convention */
/** Weighted(?) software identity */
export type HaiphenSoftwareIdentity = { low: number; high: number };

/** Relationship between two `packages` */
export type HaiphenSoftwarePackage = {
  identity: HaiphenSoftwareIdentity;
  labels: string[];
  properties: {
    /** package name */
    software: string;
    /** package description */
    description: string;
    /** package author url */
    author: string;
    /** dependency name (if software is in a path) */
    dependency: string;
    /** package license */
    license: string;
    /** package version */
    version: string;
    /** List of package vulnerabilities */
    vulnerabilities: string;
    /** Relationship weighting(?) */
    weight: string;
  };
};

/** Relationship between two `packages` */
export type HaiphenSegmentRelationship = {
  identity: HaiphenSoftwareIdentity;
  start: HaiphenSoftwareIdentity;
  end: HaiphenSoftwareIdentity;
  type: string & "has_dependency";
  properties: Record<string, any>;
};

/** An analysis segment that links two `packages` */
export type HaiphenAnalysisSegment = {
  start: HaiphenSoftwarePackage;
  relationship: HaiphenSegmentRelationship;
  end: HaiphenSoftwarePackage;
};

/** Response from dependency analysis graphql query */
export type HaiphenPackageAnalysis = {
  start: HaiphenSoftwarePackage;
  end: HaiphenSoftwarePackage;
  segments: HaiphenAnalysisSegment[];
};

export type NVDCVEMetaData = { ID: string; ASSIGNER: string };

export type NVDCVEReferenceData = {
  url: string;
  name: string;
  refsource: string;
  tags: string[];
};
export type NVDCVEPropDescription = { lang: string; value: string };

type NVDCVE = { cve: NVDCVEItem };
type NVDCVEItem = {
  data_type: string;
  data_format: string;
  data_version: string;
  CVE_data_meta: NVDCVEMetaData;

  description: {
    description_data: NVDCVEPropDescription[];
  };

  references: {
    reference_data: NVDCVEReferenceData[];
  };

  problemtype: {
    problemtype_data: {
      description: NVDCVEPropDescription[];
    }[];
  };
};

/** NVD (National Vulnerability Database) CVE type def */
export type NVDCVEResult = {
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
  result: {
    CVE_data_type: string;
    CVE_data_format: string;
    CVE_data_version: string;
    CVE_data_timestamp: string;
    CVE_Items: NVDCVE[];
  };
} & Record<string, any>;
