export const config = {
  runtime: 'edge',
};

const sleep = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 1000)
  })
}
 
export default async function handler() {
  const encoder = new TextEncoder();
 
  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(
          '<html><head><title>Hello + Streaming</title></head><body>',
        ),
      );
      await sleep()
      controller.enqueue(encoder.encode('<h5>Streaming + Streaming</h5>'));
      await sleep()
      controller.enqueue(encoder.encode('<p>In this example, we use the fetch() API to make a request to the /stream endpoint on the server and get a ReadableStream object from the response.</p>'))
      await sleep()
      controller.enqueue(encoder.encode('<p style="color: red">We then enter a while loop that reads the stream data in chunks and decodes it from binary to text using the TextDecoder API. We parse the resulting JSON string using JSON.parse() to get the original object, and then append the value of the message property to the textContent property of the streamData element.</p>'))
      await sleep()
      controller.enqueue(encoder.encode('<p>Note that this is a simplified example, and in a real-world application, you would need to handle errors and other edge cases, and ensure that your JSON data is correctly encoded and decoded on both the server and client sides.</p>'))
      controller.enqueue(encoder.encode('</body></html>'));
      controller.close();
    },
  });
 
  return new Response(readable, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}