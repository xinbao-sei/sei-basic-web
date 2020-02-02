import pwa from './en-US/pwa';
import login from './en-US/login'
import appModule from './en-US/appModule'
import menu from './en-US/menu'

export default {
  "app.request.error": "Interface request exception",
  "app.request.401": "Session exception",
  "app.request.401。message": "The current session timed out or failed, Please log in again",
  ...pwa,
  ...appModule,
  ...login,
  ...menu,
  "global.tenant.required": "Please t!",
  "global.operation": "Action",
  "global.code": "Code",
  "global.code.required": "Code is required",
  "global.name": "Name",
  "global.name.required": "Name is required",
  "global.remark": "Remark",
  "global.remark.required": "Remark is required",
  "global.frozen": "Frozen",
  "global.freezing": "Freezing",
  "global.add": "New",
  "global.save": "Save",
  "global.ok": "OK",
  "global.rank": "Rank",
  "global.back": "Go Back",
  "global.search": "Type keyword to query",
  "global.search.code_name": "Type code or name to query",
  "global.rank.required": "Rank is required",
  "global.delete": "Delete",
  "global.refresh": "Refresh",
  "global.delete.confirm": "Are you sure to delete it?",
  "global.remove.confirm": "Are you sure to remove it?",
  "global.warning": "Warning:{title}",
  "global.warning.delete.title": "Can't recover after deleted",
  "global.warning.remove.title": "Data on the current item will be lost",
  "global.save-success": "Save successfully",
  "global.delete-success": "Delete successfully",
};
