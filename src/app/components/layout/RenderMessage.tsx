import { Check, Copy } from "lucide-react";
import React, { Children, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from 'axios';

// Define the type for the message prop
interface RenderMessageProps {
  message: {
    content: string;
  };
}

const RenderMessage: React.FC<RenderMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false); // State to track if content was copied
  const [extractedLinks, setExtractedLinks] = useState(new Map<string, string>());
  const [processedMessage, setProcessedMessage] = useState('');

  // Process and modify the message content
  const processMessage = async () => {
    const tempLinks = new Map<string, string>();
    let content = message.content
      .replace(/(【[^】]*】)(?=.*\1)/g, "") // Remove duplicate markers
      .replace(/【[^】]*】/g, ""); // Remove all remaining markers

    // Handle PDF links
    for (const match of message.content.matchAll(/【\d+:\d+†(\w+\.pdf)】/g)) {
      const fileName = match[1]; // e.g. 'p17.pdf' or 'other.pdf'
      
      if (fileName.startsWith('p')) {
        // For files starting with 'p', use IRS.gov URL
        const irsUrl = `https://www.irs.gov/pub/irs-pdf/${fileName}`;
        if (!tempLinks.has(irsUrl)) {
          tempLinks.set(irsUrl, fileName);
        }
      } else {
        // For other files, request from backend
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/get-documents-url`, {
            filename: fileName
          });
          
          if (!tempLinks.has(data.url)) {
            tempLinks.set(data.url, fileName);
          }
        } catch (error) {
          console.error('Error fetching URL:', error);
        }
      }
    }

    // Remove PDF markers and colons - Updated regex to match the full filename pattern
    content = content
      .replace(/【\d+:\d+†(p\w+\.pdf)】/g, "")
      .replace(/:/g, "");

    setExtractedLinks(tempLinks);
    setProcessedMessage(content);
  };

  useEffect(() => {
    processMessage();
  }, [message.content]);

  const uniqueLinks = Array.from(extractedLinks.entries()); // Convert the map to an array

  // Function to copy content to the clipboard
  const copyToClipboard = () => {
    const fullText = `${processedMessage}\n\n${uniqueLinks
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
                  {children}
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
          a: ({ children, href }) => {
            // Ensure the href is correctly formatted
            let fixedHref = href;

            if (href && href.startsWith("https/")) {
              fixedHref = href.replace("https//", "https://");
            }
            return (
              <a
                href={fixedHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-regal-blue"
              >
                {children}
              </a>
            );
          },
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
        {processedMessage}
      </ReactMarkdown>
      {linksContainer}
    </>
  );
};

export default RenderMessage;
