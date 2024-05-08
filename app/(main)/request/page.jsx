import SimpleScreen from "@/app/components/simpleScreen";

function RequestPage() {
  return (
    <div>
      <SimpleScreen
        title="Do you have an image?"
        firstButton="Yes    "
        secondButton="No     "
        hrefOne={"/haveimage"}
        hrefTwo={"/tagsearch"}
        style="px-28"
      />
    </div>
  );
}

export default RequestPage;
