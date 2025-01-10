import { Check, Copy } from "lucide-react";
import React, { Children, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Define the type for the message prop
interface RenderMessageProps {
  message: {
    content: string;
  };
}

const RenderMessage: React.FC<RenderMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false); // State to track if content was copied
  const extractedLinks = new Map<string, string>(); // Map to store unique links with counters

  // Process and modify the message content
  const modifiedMessage = message.content
    .replace(/(【\d+:\d+†p\w+\.pdf】)(?=.*\1)/g, "") // Remove consecutive duplicates
    .replace(/【\d+:\d+†source】/g, "") // Remove specific source markers
    .replace(/【\d+:\d+†(p\w+)\.pdf】/g, (match, fileName) => {
      const url = `https://www.irs.gov/pub/irs-pdf/${fileName}.pdf`;
      if (!extractedLinks.has(url)) {
        extractedLinks.set(url, fileName); // Map the URL to its unique counter
      }
      return ""; // Replace in the main content with an empty string
    })
    .replace(/:/g, ""); // Remove all colons;

  const uniqueLinks = Array.from(extractedLinks.entries()); // Convert the map to an array

  // Function to copy content to the clipboard
  const copyToClipboard = () => {
    const fullText = `${modifiedMessage}\n\n${uniqueLinks
      .map(([url, index]) => `[ [${index}]( ${url} ) ]`)
      .join("\n")}`;

    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        setCopied(true); // Update state to show feedback
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      })
      .catch(() => {
        setCopied(false); // In case of error, reset copied state
      });
  };

  const linksContainer = (
    <div className="text-right justify-end py-3 flex items-end flex-wrap">
      {uniqueLinks.map(([url, index]) => (
        <ReactMarkdown
          key={index}
          rehypePlugins={[remarkGfm]}
          components={{
            a: ({ children, href }) => {
              // Extract the filename from the URL
              const fileNameMatch = /\/([\w-]+\.pdf)$/.exec(href || "");
              const fileName = fileNameMatch ? fileNameMatch[1] : "File";

              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-regal-blue"
                  title={fileName} // Tooltip text
                >
                  {children + ".pdf"}
                </a>
              );
            },
            p: ({ children }) => (
              <p className="mb-0 mt-auto">{children}</p> // Move <p> to the bottom
            ),
          }}
        >
          {`[ [${index}]( ${url} ) ]`}
        </ReactMarkdown>
      ))}
    </div>
  );

  return (
    <>
      {/* Copy button */}
      <div className="flex justify-between items-center py-2 px-4 relative">
        <button
          onClick={copyToClipboard}
          className=" text-gray-500 hover:text-gray-800 rounded-md absolute right-0 top-0"
        >
          {!copied ? <Copy width={20} /> : <Check width={20} />}
        </button>
      </div>

      {/* Message content with links */}
      <ReactMarkdown
        rehypePlugins={[remarkGfm]}
        components={{
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-regal-blue"
            >
              {children}
            </a>
          ),
          p: ({ children }) => <p className=" leading-10">{children}</p>,
          table: ({ children, ...props }) => (
            <table
              className="w-full border-separate border-spacing-0 border-gray-400 text-center rounded-lg mb-6 table-auto"
              {...props}
            >
              {children}
            </table>
          ),
          tr: ({ children, ...props }) => (
            <tr className="even:bg-gray-100" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-gray-400 bg-gray-300 p-2 text-lg text-center"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="border border-gray-400 bg-white p-2 text-base"
              {...props}
            >
              {children}
            </td>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-5 leading-10" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-5 leading-10" {...props}>
              <span>{children}</span>
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="my-2 leading-10" {...props}>
              <span className="text-base">{children}</span>
            </li>
          ),
          strong: ({ children, ...props }) => (
            <strong className="text-lg" {...props}>
              {children}:
              <br />
            </strong>
          ),
        }}
      >
        {modifiedMessage}
      </ReactMarkdown>
      {linksContainer}
    </>
  );
};

export default RenderMessage;
