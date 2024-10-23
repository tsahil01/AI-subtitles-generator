export async function signAndSend(publicKey: any, signMessage: any, signIn: any, signOut: any, disconnect: any, session: any, toast: any) {
    if (!publicKey || !signMessage) return;

    try {
        const message = new TextEncoder().encode("Sign this message");
        const signature = await signMessage(message);
        const signatureHex = Buffer.from(signature).toString("hex");

        console.log("Signature:", signatureHex);
        console.log("Public Key:", publicKey.toString());

        const signInResult = await signIn("credentials", {
            web3Address: publicKey.toString(),
            signature: signatureHex,
            redirect: false,
        });

        if (signInResult?.error) {
            toast({
                title: "Sign In Failed",
                description: signInResult.error,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Signed In",
                description: "You have successfully signed in",
            });
        }
    } catch (error) {
        console.error("Failed to sign the message", error);
        toast({
            title: "Sign In Failed",
            description: "Failed to sign the message",
            variant: "destructive",
        });
    }
}