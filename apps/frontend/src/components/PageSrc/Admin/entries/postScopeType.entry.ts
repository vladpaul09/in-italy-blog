enum PostScope {
  EVERYWHERE = "EVERYWHERE",
  REGION_ONLY = "REGION_ONLY",
  PROVINCE_ONLY = "PROVINCE_ONLY",
  REGION_AND_PROVINCE = "REGION_AND_PROVINCE",
  REGION_AND_MUNICIPALITIES = "REGION_AND_MUNICIPALITIES",
  PROVINCE_AND_MUNICIPALITIES = "PROVINCE_AND_MUNICIPALITIES",
  REGION_PROVINCES_AND_MUNICIPALITIES = "REGION_PROVINCES_AND_MUNICIPALITIES",
  MUNICIPALITIES_SELECTED = "MUNICIPALITIES_SELECTED",
  ALL_MUNICIPALITIES = "ALL_MUNICIPALITIES",
}

export const postScopeChoices = [
  { id: PostScope.EVERYWHERE, name: "postScope.everywhere" },
  { id: PostScope.REGION_ONLY, name: "postScope.region_only" },
  { id: PostScope.PROVINCE_ONLY, name: "postScope.province_only" },
  { id: PostScope.REGION_AND_PROVINCE, name: "postScope.region_and_province" },
  { id: PostScope.REGION_AND_MUNICIPALITIES, name: "postScope.region_and_municipalities" },
  { id: PostScope.PROVINCE_AND_MUNICIPALITIES, name: "postScope.province_and_municipalities" },
  { id: PostScope.REGION_PROVINCES_AND_MUNICIPALITIES, name: "postScope.region_provinces_and_municipalities" },
  { id: PostScope.MUNICIPALITIES_SELECTED, name: "postScope.municipalities_selected" },
  { id: PostScope.ALL_MUNICIPALITIES, name: "postScope.all_municipalities" },
];

export default PostScope;
