document.addEventListener('DOMContentLoaded', () => {
    let dropdownsAdded = false;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach((node) => {
                    if (node.id === 'loras_button') {
                        setTimeout(() => document.querySelector("#loras_button").click(), 1000);
                        setTimeout(() => {
                            if (!dropdownsAdded) {
                                const lorastextbox = document.querySelector("#lorastextbox > label > textarea");
                                const container = document.querySelector("#lorastextbox");
                                const prompt = document.querySelector("#txt2img_prompt > label > textarea");
								function updateSelects() {
									const loras = lorastextbox.value.split('\n');
									const selects = container.querySelectorAll('select');
									for (const loraselect of selects) {
										const selectedValue = loraselect.value;
										loraselect.innerHTML = '';
										const emptyOption = document.createElement('option');
										loraselect.appendChild(emptyOption);
										for (const lora of loras) {
											const loraoption = document.createElement('option');
											loraoption.textContent = lora.substring(lora.lastIndexOf('/') + 1);
											loraselect.appendChild(loraoption);
										}
										loraselect.value = selectedValue;
									}
								}
								const updateLorasListButton = document.querySelector("#update_loras_list");
								const lorasButton = document.querySelector("#loras_button");
								updateLorasListButton.addEventListener('click', () => {
									lorasButton.click();
									setTimeout(updateSelects, 1000);
								});
                                function updatePrompt() {
                                    const selects = container.querySelectorAll('select');
                                    const ranges = container.querySelectorAll('input[type="range"]');
                                    const lines = [];
                                    for (let i = 0; i < selects.length; i++) {
                                        const select = selects[i];
                                        const range = ranges[i];
                                        if (select.value) {
                                            lines.push(`<lora:${select.value}:${range.value}>`);
                                        }
                                    }
                                    const text = lines.join(', ');
                                    const regex = /<lora:.*?>/g;
                                    let match;
                                    let startIndex = -1;
                                    let endIndex = -1;
                                    while ((match = regex.exec(prompt.value)) !== null) {
                                        if (startIndex === -1) {
                                            startIndex = match.index;
                                        }
                                        endIndex = match.index + match[0].length;
                                    }
                                    if (startIndex !== -1 && endIndex !== -1) {
                                        prompt.setRangeText(text, startIndex, endIndex);
                                    } else {
                                        if (prompt.value) {
                                            prompt.setRangeText(text, prompt.selectionStart, prompt.selectionEnd, 'end');
                                        } else {
                                            prompt.value = text;
                                        }
                                    }
                                    const inputEvent = new Event('input', { bubbles: true });
                                    prompt.dispatchEvent(inputEvent);
                                }
                                function handleSelectChange(event) {
                                    updatePrompt();
                                }
                                function handleRangeInput(event) {
                                    const range = event.target;
                                    const span = range.nextElementSibling;
                                    span.textContent = range.value;
                                    updatePrompt();
                                }
                                const addLink = document.createElement('a');
                                addLink.textContent = '+ добавить больше +';
                                addLink.href = '#';
                                addLink.addEventListener('click', (event) => {
                                    event.preventDefault();
                                    addSelect();
                                });
                                function addSelect() {
                                    const wrapper = document.createElement('div');
                                    const loraselect = document.createElement('select');
                                    loraselect.addEventListener('change', handleSelectChange);
                                    wrapper.appendChild(loraselect);
                                    const loraslider = document.createElement('input');
                                    loraslider.type = 'range';
                                    loraslider.min = '-1';
                                    loraslider.max = '1';
                                    loraslider.step = '0.05';
                                    loraslider.addEventListener('input', handleRangeInput);
                                    wrapper.appendChild(loraslider);
                                    const loraspan = document.createElement('span');
                                    loraspan.textContent = '0';
                                    wrapper.appendChild(loraspan);

                                    container.insertBefore(wrapper, addLink);
                                    updateSelects();
                                }
                                container.appendChild(addLink);
                                for (let i = 0; i < 5; i++) {
                                    addSelect();
                                }
                                lorastextbox.addEventListener('input', updateSelects);
                                dropdownsAdded = true;
								document.querySelector("#img2img_script_container #loras_txt2img").parentElement.remove()
                            }
                        }, 3000)
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
