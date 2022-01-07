export function toggleResponse(messageService, data) {
  if (data.status === 200) {
    messageService.showMessage({
      type: "success",
      title: data.message,
      body: data?.details,
    });
  } else {
    messageService.showMessage({
      type: "error",
      title: data.message,
      body: data?.details,
    });
  }
}
