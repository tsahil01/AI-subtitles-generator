export function PrivacyMain() {
  return (
    <>
      <main className="container mx-auto px-4 py-6 space-y-6 sm:py-8 sm:space-y-6">
          <h2 className="text-2xl font-bold md:text-4xl text-center">Privacy Policy</h2>

        <div className="border-4 border-purple-900 p-4 max-w-4xl mx-auto flex flex-col gap-5 rounded-xl">
          <span className="text-justify" >
            AI Subtitler is committed to protecting the privacy of its users.
            This Privacy Policy outlines how we collect, use, and safeguard your
            information when you use our services. By using AI Subtitler, you
            agree to the practices described in this policy.
          </span>
          <section className="flex flex-col gap-2 my-3">
            <h3 className="text-2xl font-bold">1. Information Collection</h3>
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
          </section>

          <section className="flex flex-col gap-2 my-3">
            <h3 className="text-2xl font-bold">2. Use of Information</h3>
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
          </section>

          <section className="flex flex-col gap-2 my-3">
            <h3 className="text-2xl font-bold">3. Data Security</h3>
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
          </section>

          <section className="flex flex-col gap-2 my-3">
            <h3 className="text-2xl font-bold">4. User Rights</h3>
            <p className="text-justify">
              <div className="font-semibold">Access and Deletion:</div> You have
              the right to request access to or deletion of your stored files.
              Please contact our support team for assistance.
            </p>
            <p className="text-justify">
              <div className="font-semibold">Data Portability:</div> Users may
              download subtitle files in SRT and VTT formats.
            </p>
          </section>

          <section className="flex flex-col gap-2 my-3">
            <h3 className="text-2xl font-bold">
              5. Data Sharing and Disclosure
            </h3>
            <p className="text-justify">
              We do not sell or share your data with third parties for marketing
              purposes. Limited data may be shared as required for legal
              purposes or in compliance with regulatory authorities.
            </p>
          </section>

          <section className="flex flex-col gap-2 my-3">
            <h3 className="text-2xl font-bold">
              6. Changes to this Privacy Policy
            </h3>
            <p className="text-justify">
              We may update this Privacy Policy as needed. Users will be
              notified of any significant changes through our platform.
            </p>
          </section>

          <section className="flex flex-col gap-2 my-3">
            <h3 className="text-lg font-semibold text-center">Contact Us</h3>
            <p className="text-justify">
              If you have any questions about this Privacy Policy, please
              contact us at [Contact Information].
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
