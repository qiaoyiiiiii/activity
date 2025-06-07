#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import re
import os

def load_rules_from_file(rules_file_path):
    """
    从外部rules.txt文件加载规则
    
    Args:
        rules_file_path (str): rules.txt文件的路径
        
    Returns:
        dict: 包含所有规则的字典
    """
    rules = {
        'required_fields': [],
        'min_length': 50,
        'invalid_contents': ["无", "无影响", "没有影响", "不影响"]
    }
    
    # 如果规则文件不存在，返回默认规则
    if not os.path.exists(rules_file_path):
        print(f"警告：规则文件 {rules_file_path} 不存在，使用默认规则")
        # 设置默认规则
        rules['required_fields'] = [
            r'原因分析:.+',
            r'解决方案:.+',
            r'影响分析:.+',
            r'1、对单机的影响:.+',
            r'2、对双机的影响:.+',
            r'3、对流水线的影响:.+',
            r'4、对DMS 的影响\(含DMS1\.0和DMS2\.0\):.+',
            r'5、对多语言的影响:.+',
            r'测试建议:.+',
            r'评审人:.+'
        ]
        return rules
    
    try:
        with open(rules_file_path, 'r', encoding='utf-8') as f:
            current_section = None
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                
                # 检查是否是节标题
                if line.startswith('[') and line.endswith(']'):
                    current_section = line[1:-1].lower()
                    continue
                
                # 根据当前节处理规则
                if current_section == 'required_fields':
                    rules['required_fields'].append(line)
                elif current_section == 'min_length' and line.isdigit():
                    rules['min_length'] = int(line)
                elif current_section == 'invalid_contents':
                    rules['invalid_contents'].append(line)
        
        # 如果没有加载到必要字段，使用默认值
        if not rules['required_fields']:
            print("警告：未在规则文件中找到必要字段，使用默认规则")
            rules['required_fields'] = [
                r'原因分析:.+',
                r'解决方案:.+',
                r'影响分析:.+',
                r'1、对单机的影响:.+',
                r'2、对双机的影响:.+',
                r'3、对流水线的影响:.+',
                r'4、对DMS 的影响\(含DMS1\.0和DMS2\.0\):.+',
                r'5、对多语言的影响:.+',
                r'测试建议:.+',
                r'评审人:.+'
            ]
            
        return rules
    except Exception as e:
        print(f"错误：读取规则文件时出错 - {str(e)}")
        # 发生错误时返回默认规则
        rules['required_fields'] = [
            r'原因分析:.+',
            r'解决方案:.+',
            r'影响分析:.+',
            r'1、对单机的影响:.+',
            r'2、对双机的影响:.+',
            r'3、对流水线的影响:.+',
            r'4、对DMS 的影响\(含DMS1\.0和DMS2\.0\):.+',
            r'5、对多语言的影响:.+',
            r'测试建议:.+',
            r'评审人:.+'
        ]
        return rules

def check_change_format(lines, rules):
    """
    检查需求变更、Bug修复或重构代码格式是否正确
    
    Args:
        lines (list): 提交消息的行列表
        rules (dict): 规则字典
        
    Returns:
        tuple: (是否有效, 错误消息)
    """
    # 检查标题行格式
    if not re.match(r'\[(需求变更|Bug 修复|重构代码)\]\([^\)]+\).+', lines[0]):
        return False, "标题行格式错误，应为'[需求变更/Bug 修复/重构代码](项目代号) bug号及描述'"
    
    # 检查是否有空行
    if len(lines) < 2 or lines[1].strip():
        return False, "标题后应有一个空行"
    
    content = '\n'.join(lines[2:])
    
    # 检查必要字段是否存在
    for field_pattern in rules['required_fields']:
        field_match = re.search(field_pattern, content, re.MULTILINE)
        if not field_match:
            field_name = field_pattern.split(':')[0] + ':'
            return False, f"缺少必要字段 '{field_name}'"
        
        # 提取字段内容并检查长度和内容
        field_content = field_match.group(0).split(':', 1)[1].strip()
        
        # 检查内容长度
        if len(field_content) < rules['min_length']:
            field_name = field_pattern.split(':')[0] + ':'
            return False, f"字段 '{field_name}' 的内容长度不足{rules['min_length']}个字符，当前长度：{len(field_content)}"
        
        # 检查是否包含无效内容
        for invalid in rules['invalid_contents']:
            if field_content == invalid or field_content.startswith(invalid + '，') or field_content.startswith(invalid + ','):
                field_name = field_pattern.split(':')[0] + ':'
                return False, f"字段 '{field_name}' 不能仅填写 '{invalid}' 或以 '{invalid}' 开头"
    
    return True, ""

def check_feature_add_format(lines, rules):
    """
    检查功能新增格式是否正确
    
    Args:
        lines (list): 提交消息的行列表
        rules (dict): 规则字典
        
    Returns:
        tuple: (是否有效, 错误消息)
    """
    # 检查标题行格式
    title_match = re.match(r'\[功能新增\]\([^\)]+\)(.+)', lines[0])
    if not title_match:
        return False, "标题行格式错误，应为'[功能新增](项目代号)简期扼要描述新增的功能'"
    
    # 检查描述长度
    description = title_match.group(1).strip()
    if len(description) > 50:
        return False, f"功能描述超过50个字符，当前长度：{len(description)}"
    
    if lines[1].strip():
        return False, "标题后应有一个空行"

    # 检查是否有空行
    if len(lines) < 3:  # 至少需要3行：标题行、空行和评审人行
        return False, "提交消息格式不完整，需要标题行后有一个空行，然后是评审人信息"
    
    # 检查评审人
    content = '\n'.join(lines[2:])
    reviewer_match = re.search(r'评审人:(.+)', content, re.MULTILINE)
    if not reviewer_match:
        return False, "缺少必要字段 '评审人:'"
    
    # 提取评审人内容并检查
    reviewer_content = reviewer_match.group(1).strip()
    
    # 检查内容长度
    if len(reviewer_content) < rules['min_length']:
        return False, f"字段 '评审人:' 的内容长度不足{rules['min_length']}个字符，当前长度：{len(reviewer_content)}"
    
    # 检查是否包含无效内容
    for invalid in rules['invalid_contents']:
        if reviewer_content == invalid or reviewer_content.startswith(invalid + '，') or reviewer_content.startswith(invalid + ','):
            return False, f"字段 '评审人:' 不能仅填写 '{invalid}' 或以 '{invalid}' 开头"
    
    return True, ""

def main():
    # 获取commit消息文件路径
    commit_msg_file = sys.argv[1]
    
    # 读取commit消息
    with open(commit_msg_file, 'r', encoding='utf-8') as f:
        commit_msg = f.read()
    
    # 分割行
    lines = commit_msg.splitlines()
    if not lines:
        print("错误：提交消息不能为空")
        sys.exit(1)
    
    # 获取规则文件路径
    script_dir = os.path.dirname(os.path.abspath(__file__))
    rules_file_path = os.path.join(script_dir, 'rules.txt')
    
    # 加载规则
    rules = load_rules_from_file(rules_file_path)
    
    # 根据提交类型检查格式
    if any(tag in lines[0] for tag in ['[需求变更]', '[Bug 修复]', '[重构代码]']):
        is_valid, error_msg = check_change_format(lines, rules)
    elif '[功能新增]' in lines[0]:
        is_valid, error_msg = check_feature_add_format(lines, rules)
    else:
        print("错误：提交消息必须以'[需求变更]'、'[Bug 修复]'、'[重构代码]'或'[功能新增]'开头")
        sys.exit(1)
    
    if not is_valid:
        print(f"错误：{error_msg}")
        sys.exit(1)
    
    # 格式正确，允许提交
    print("检测通过，已提交！")
    sys.exit(0)

if __name__ == "__main__":
    main()