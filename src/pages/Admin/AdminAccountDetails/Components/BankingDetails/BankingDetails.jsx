import { Input, Radio, Form } from "antd";

export default function BankingDetails() {
  return (
    <div className="">
      <p className="text-xl text-primary mb-3">Banking Details</p>
      <div className="form-card rounded-lg">
        <header className="px-5 md:px-5 py-5 border-0 border-b border-solid border-[#b6b6b6]">
          <p className="text-xl font-semibold">Enter Account Details</p>
        </header>

        <div className="flex items-center flex-wrap gap-x-10 gap-y-2 px-5 py-5">
          {/* Account Holder Name */}
          <Form.Item
            label={"Account Holder Name"}
            name="accHolderName"
            className="custom-form-item"
            rules={[
              {
                required: true,
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          {/* Account Number */}
          <Form.Item
            label={"Account Number"}
            name="bankAccNum"
            className="custom-form-item"
            rules={[
              {
                required: true,
              },
              {
                pattern: /^[A-Za-z0-9]+$/,
                message: "Please enter a valid Account Number",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          {/* Confirm Account Number */}
          <Form.Item
            label={"Confirm Account Number"}
            name="confirmAccountNumber"
            className="custom-form-item"
            dependencies={["bankAccNum"]}
            rules={[
              {
                required: true,
              },
              {
                pattern: /^[A-Za-z0-9]+$/,
                message: "Please enter a valid Account Number",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("bankAccNum") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Account Numbers do not match");
                },
              }),
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          {/* IFSC code */}
          <Form.Item
            label={"IFSC Code"}
            name="ifsc"
            className="custom-form-item"
            rules={[
              {
                required: true,
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
        </div>
      </div>
    </div>
  );
}
