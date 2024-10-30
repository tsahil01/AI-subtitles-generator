import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function PrivacyMain() {
  return (
    <>
      <Card className="container mx-auto px-4 max-w-4xl mt-5 border-4 border-purple-900">
        <CardHeader>
          <CardTitle className="text-2xl font-bold md:text-4xl text-center">
            Privacy Policy
          </CardTitle>
          <CardDescription className="text-justify mt-3 text-md">
            AI Subtitler is committed to protecting the privacy of its users.
            This Privacy Policy outlines how we collect, use, and safeguard your
            information when you use our services. By using AI Subtitler, you
            agree to the practices described in this policy.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 rounded-xl border-b">
          <div className="flex flex-col gap-1 my-3 text-center">
            <h3 className="text-xl font-bold">Information Collection</h3>
            <p className="text-justify">
              <div className="font-semibold">User-Provided Information:</div> To
              generate AI-powered subtitles, you may provide video files and
              metadata necessary for processing. Files are securely stored on
              AWS S3 for retrieval.
            </p>
            <p className="text-justify">
              <div className="font-semibold">Wallet Integration:</div> We
              support secure payments through the Solana Blockchain wallet.
              Wallet addresses are stored only for transactional purposes and
              are not used to identify individuals.
            </p>
          </div>

          <div className="flex flex-col gap-1 my-3 text-center">
            <h3 className="text-xl font-bold">Use of Information</h3>
            <p className="text-justify">
              <div className="font-semibold">Subtitle Generation:</div> Your
              files are used solely for generating subtitles. We do not access,
              analyze, or share content beyond the AI subtitle generation
              process.
            </p>
            <p className="text-justify">
              <div className="font-semibold">File Storage:</div> User-uploaded
              files are stored on AWS S3 and may be retained for processing and
              future retrieval based on usage.
            </p>
            <p className="text-justify">
              <div className="font-semibold">Payment Processing:</div> We use
              the Solana Blockchain for secure microtransactions on a
              pay-per-use basis, ensuring transparent and encrypted
              transactions.
            </p>
          </div>

          <div className="flex flex-col gap-1 my-3 text-center">
            <h3 className="text-xl font-bold">Data Security</h3>
            <p className="text-justify">
              <div className="font-semibold">Encryption:</div> We apply
              encryption methods for data in transit and at rest, especially for
              payment details and file storage.
            </p>
            <p className="text-justify">
              <div className="font-semibold">AWS Security Compliance:</div>{" "}
              Files are stored on AWS S3, which complies with industry standards
              for data protection and security.
            </p>
          </div>

          <div className="flex flex-col gap-1 my-3 text-center">
            <h3 className="text-xl font-bold">User Rights</h3>
            <p className="text-justify">
              <div className="font-semibold">Access and Deletion:</div> You have
              the right to request access to or deletion of your stored files.
              Please contact our support team for assistance.
            </p>
            <p className="text-justify">
              <div className="font-semibold">Data Portability:</div> Users may
              download subtitle files in SRT and VTT formats.
            </p>
          </div>

          <div className="flex flex-col gap-1 my-3 text-center">
            <h3 className="text-xl font-bold">Data Sharing and Disclosure</h3>
            <p className="text-justify">
              We do not sell or share your data with third parties for marketing
              purposes. Limited data may be shared as required for legal
              purposes or in compliance with regulatory authorities.
            </p>
          </div>

          <div className="flex flex-col gap-1 my-3 text-center">
            <h3 className="text-xl font-bold">
              Changes to this Privacy Policy
            </h3>
            <p className="text-justify">
              We may update this Privacy Policy as needed. Users will be
              notified of any significant changes through our platform.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-1 my-3 text-center">
          <h3 className="text-lg font-semibold text-center">Contact Us</h3>
          <p className="text-justify">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <span className="font-semibold underline">{`sahiltiwaskar2003@gmail.com`}</span>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
