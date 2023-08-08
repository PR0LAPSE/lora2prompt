import modules.scripts as scripts
import gradio as gr
import os
sdroot = "/".join(os.path.realpath(__file__).split("extensions")[0].split("/")[:-1])
loras_folder_path = os.path.join(sdroot,"models/Lora")
lycoris_folder_path = os.path.join(sdroot,"models/LyCORIS")
class ExtensionTemplateScript(scripts.Script):
        def title(self):
                return "добавить лоры в промпт"
        def show(self, is_img2img):
                return scripts.AlwaysVisible
        def ui(self, is_img2img):
                with gr.Accordion('лоры в промпт', elem_id="loras_txt2img", open=True):
                        def run():
                            loras_files = [os.path.splitext(os.path.basename(file))[0] for file in os.listdir(loras_folder_path)]
                            return '\n'.join(loras_files)
                        lorastextbox = gr.Textbox(label="", lines=10, elem_id="lorastextbox")
                        loras_button = gr.Button("обновить список лор", elem_id="loras_button")
                        loras_button.click(fn=run, outputs=lorastextbox)
                        gr.HTML("""<div id="update_loras_list">⟲ обновить список лор</div>""")
                return [lorastextbox, loras_button]
