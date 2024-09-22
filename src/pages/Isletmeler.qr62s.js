// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import {
  getCategories,
  getSubcategories,
  getOrganizationsData,
  getCities,
  getStates,
} from 'backend/organizations';

$w.onReady(async function () {
  let defaultCategory;
  let selectedSubcategoryIds = [];
  // initialize
  const allCategories = await getCategories();
  defaultCategory = allCategories.items[0];
  // const subcategories = await getSubcategories(defaultCategory._id);
  // defaultSubcategoryIds = subcategories.items.map(subCategory => subCategory._id);

  // Render Category dropdown
  await renderCategoryDropdown(allCategories, defaultCategory);

  // Render Subcategory checkboxes
  // await renderSubCategoryCheckboxes(defaultCategory)

  // Render Organization list
  await renderOrganizationList([]);

  // Render State dropdown
  await renderStates(selectedSubcategoryIds);

  // Render Cities
  await renderCities(selectedSubcategoryIds);
});

const renderCategoryDropdown = async (categories, selectedCategory) => {
  const options = categories.items.map((item) => ({ label: item.label, value: item._id }));
  $w('#categoryDropdown').options = [{ label: 'Tüm Kategoriler', value: '-1' }, ...options];
  $w('#categoryDropdown').selectedIndex = 0;
  $w('#categoryDropdown').onChange(async (event) => {
    const selectedIndex = event.target.selectedIndex;
    selectedCategory = {
      _id: event.target.value,
      label: event.target.options[parseInt(selectedIndex)].label,
    };

    // Show loading message
    $w('#organizationList').data = [];
    showLoader();

    await renderSubCategoryCheckboxes(selectedCategory);

    // Get subcategories for the selected category
    const subcategories = await getSubcategories(selectedCategory._id);
    const subcategoryIds = subcategories.items.map((subCategory) => subCategory._id);

    // Render organization list based on the selected category's subcategories
    await renderOrganizationList(subcategoryIds);
    hideLoader();
  });
};
function showNotFound() {
  $w('#notFound').show();
}
function hideNotFound() {
  $w('#notFound').hide();
}
function showLoader() {
  $w('#loader').show();
  $w('#organizationList').data = [];
  hideNotFound();
}
function hideLoader() {
  $w('#loader').hide();
}

const renderSubCategoryCheckboxes = async (category) => {
  // Show loading state
  $w('#subCategories').options = [];
  $w('#subCategories').label = '';
  const subCategories = await getSubcategories(category._id);
  const options = subCategories.items.map((subcategory) => {
    return {
      label: subcategory.label,
      value: subcategory._id,
    };
  });
  $w('#subCategories').options = options;
  if (options.length > 0) {
    $w('#subCategories').label = 'Alt Kategoriler';
  }

  $w('#subCategories').onChange(async (event) => {
    await renderOrganizationList(event.target.value);
  });
};
const renderOrganizationList = async (subCategoryIds, city = null, state = null) => {
  showLoader();
  hideNotFound();
  const { organizations } = await getOrganizationsData(subCategoryIds, city, state);
  hideLoader();
  $w('#organizationList').data = organizations;
  if (organizations.length === 0) {
    showNotFound();
  }
  $w('#organizationList').forEachItem(($item, itemData) => {
    $item('#title').text = itemData.name;
    $item('#description').text = itemData.description;
    $item('#image').src = itemData.photo;
    $item('#email').text = itemData.email;
    $item('#cityAndState').text = `${itemData.city}, ${itemData.state}`;
    $item('#phone').text = itemData.phone;
  });
};

const renderStates = async (defaultSubcategoryIds) => {
  const states = await getStates();
  const options = states.items.map((state) => {
    return {
      label: state,
      value: state,
    };
  });

  $w('#stateDropdown').options = [{ label: 'Tümünü Göster', value: 'all' }, ...options];
  $w('#stateDropdown').onChange(async (event) => {
    const selectedState = event.target.value;
    const selectedCity = $w('#cityDropdown').value;
    await renderOrganizationList(defaultSubcategoryIds, selectedCity, selectedState);
  });
};

const renderCities = async (defaultSubcategoryIds) => {
  const cities = await getCities();
  const options = cities.items.map((city) => {
    return {
      label: city,
      value: city,
    };
  });
  $w('#cityDropdown').options = [{ label: 'Tümünü Göster', value: 'all' }, ...options];
  $w('#cityDropdown').onChange(async (event) => {
    const selectedCity = event.target.value;
    const selectedState = $w('#stateDropdown').value;
    await renderOrganizationList(defaultSubcategoryIds, selectedCity, selectedState);
  });
};
