export function ScrollToBottomButton() {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return <button onClick={scrollToBottom}>Scroll to Bottom</button>;
}
