// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

$w.onReady(async function () {
  // Write your JavaScript here
  // let myTabs = $w("#tabs1").tabs;
  let tabOptions = await loadTabs();
  $w('#categoryDropdown').options = tabOptions;
  $w('#categoryDropdown').onChange((event) => {
    console.log(event.target.value);
    $w('#tabs1').changeTab(event.target.value);
  });
  // console.log('currentTab', $w('#tabs1').currentTab);
  // console.log('defaultTab', $w('#tabs1').defaultTab);
  // To select an element by ID use: $w('#elementID')

  // Click 'Preview' to run your code
});
function loadTabs() {
  const allTabs = $w('#tabs1').tabs;
  // $w('#tabs1').hide();
  return allTabs.map((item) => ({ label: item.label, value: item.id }));
}
